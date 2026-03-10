// app/api/generate-course-layout/route.jsx

import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { coursesTable, preferencesTable } from "../../../config/schema";

// Updated prompt for Lorito (keeps the same general structure as the tutorial: course -> chapters -> topics)
const PROMPT = `Generate a personalized language learning course based on user preferences.

This app has TWO parts:
A) Concept Lessons (theory/reading): teaches grammar + WHY it works.
B) Practice Activities (interactive): multiple choice, fill in blank, matching, quizzes, and roleplay scenarios (for later screens).

CRITICAL: Each topic MUST teach a real concept (grammar/theory). Vocabulary alone is not enough.
For every topic, include:
- conceptLesson.explanationNative: clear theory explanation in the user's native language (this is the main teaching text)
- conceptLesson.explanationTarget: a shorter version in the target language
- conceptLesson.keyRules: 4–8 bullet rules/patterns
- conceptLesson.examples: 5–10 example sentences that demonstrate the rules
- conceptLesson.commonMistakes: 3–6 mistakes + fixes
- conceptLesson.whyThisWorksNative: 2–4 sentences explaining "why" (logic/history/patterns) in plain language
- conceptLesson.genderNotesNative: only when relevant (e.g., gendered nouns, agreement)

Vocabulary must be tied to the concept and used in the examples and practice.

Rules:
- Output JSON ONLY. No markdown. No extra text.
- Match Target Language, Native Language, Level, Interests/Profession, and Goal.
- Chapters should progress from easier → harder.
- Every topic must include BOTH conceptLesson and practice.
- The response is INVALID if course.chapters is missing or empty.
- The response is INVALID if any chapter is missing topics.
- The response is INVALID if any topic is missing conceptLesson or practice.
- You MUST return the full nested course structure, not just course metadata.
- Do not summarize, abbreviate, or omit nested fields.
- For EVERY topic, generate EXACTLY:
  - 5 multipleChoice questions
  - 5 fillInTheBlank questions
  - 5 matching activities
  - 1 quiz object containing EXACTLY 5 quiz questions
- Each matching activity must contain 5 pairs.
- All practice questions must directly test the concept taught in the topic.

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "nativeLanguage": "string",
    "targetLanguage": "string",
    "courseLength": "number",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          {
            "topicTitle": "string",
            "estimatedTime": "string",
            "conceptLesson": {
              "title": "string",
              "explanationNative": "string",
              "explanationTarget": "string",
              "whyThisWorksNative": "string",
              "keyRules": ["string"],
              "genderNotesNative": "string",
              "keyVocabulary": [
                {
                  "target": "string",
                  "native": "string",
                  "partOfSpeech": "string",
                  "gender": "string",
                  "exampleTarget": "string",
                  "exampleNative": "string"
                }
              ],
              "examples": [
                {
                  "exampleTarget": "string",
                  "exampleNative": "string",
                  "noteNative": "string"
                }
              ],
              "commonMistakes": [
                {
                  "mistakeTarget": "string",
                  "fixTarget": "string",
                  "explanationNative": "string"
                }
              ],
              "miniSummaryNative": "string"
            },
            "practice": {
              "multipleChoice": [
                {
                  "questionTarget": "string",
                  "questionNative": "string",
                  "optionsTarget": ["string","string","string","string"],
                  "optionsNative": ["string","string","string","string"],
                  "answerIndex": "number",
                  "explanationNative": "string"
                }
              ],
              "fillInTheBlank": [
                {
                  "promptTarget": "string",
                  "promptNative": "string",
                  "sentenceWithBlankTarget": "string",
                  "choicesTarget": ["string","string","string","string"],
                  "answerTarget": "string",
                  "answerNative": "string"
                }
              ],
              "matching": [
                {
                  "instructionsNative": "string",
                  "pairs": [
                    { "leftTarget": "string", "rightNative": "string" }
                  ]
                }
              ],
              "quiz": {
                "title": "string",
                "questions": [
                  {
                    "type": "multipleChoice",
                    "questionTarget": "string",
                    "optionsTarget": ["string","string","string","string"],
                    "answerIndex": "number"
                  }
                ],
                "scoreMessageNative": "string"
              },
              "roleplayScenario": {
                "scenarioNative": "string",
                "starterPromptTarget": "string"
              }
            }
          }
        ]
      }
    ]
  }
}

QUALITY CHECK (MUST FOLLOW):
- conceptLesson.explanationNative must be at least 5–10 sentences and include grammar reasoning.
- keyRules must not be generic; they must be specific (e.g., for French: être vs avoir usage; ER verb conjugation patterns; agreement rules).
- examples must clearly demonstrate each rule, and include both target + native.
- if the topic involves gender/agreements, fill genderNotesNative and gender field in vocab.
- practice.multipleChoice must contain EXACTLY 5 items.
- practice.fillInTheBlank must contain EXACTLY 5 items.
- practice.matching must contain EXACTLY 5 items.
- each item in practice.matching must contain EXACTLY 5 pairs.
- practice.quiz.questions must contain EXACTLY 5 items.

FINAL OUTPUT REQUIREMENT:
- Return one complete JSON object with the full course structure.
- Do not return a partial schema.
- Do not return only top-level course fields.
- Do not omit chapters, topics, conceptLesson, or practice.
- If any required nested field is missing, regenerate internally before responding.

User Preferences JSON:
`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { courseId, ...formData } = body;

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    // 1) Save user preferences first (so we can link preferenceId in coursesTable)
    const prefInsert = await db
      .insert(preferencesTable)
      .values({
        cid: courseId,
        nativeLanguage: formData.nativeLanguage,
        targetLanguage: formData.targetLanguage,
        level: formData.level,
        interests: formData.interests ?? "",
        goal: formData.goal ?? "",
        courseLength: Number(formData.courseLength ?? 1),
        userEmail,
      })
      .returning({ id: preferencesTable.id });

    const preferenceId = prefInsert?.[0]?.id;

    // 2) Generate course JSON from Gemini
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: PROMPT + JSON.stringify(formData),
            },
          ],
        },
      ],
    });

    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Gemini returned empty response text.");
    }

    // Clean up any accidental ```json wrappers
    const rawJson = rawText.replace(/```json\s*|```/g, "").trim();

    let jsonResp;
    try {
      jsonResp = JSON.parse(rawJson);
    } catch (err) {
      console.error("FAILED TO PARSE JSON:", rawJson);
      throw new Error("Gemini returned malformed JSON.");
    }

    const course = jsonResp?.course ?? {};

    if (!Array.isArray(course?.chapters) || course.chapters.length === 0) {
      console.error("Gemini returned incomplete course JSON:", rawJson);
      throw new Error("Gemini returned incomplete course data: chapters missing.");
    }

    // 3) Ensure required DB fields exist (noOfChapters + level are NOT NULL in coursesTable)
    const computedNoOfChapters =
      Number(course?.noOfChapters) ||
      (Array.isArray(course?.chapters) ? course.chapters.length : 1) ||
      1;

    const computedLevel = course?.level || formData.level;

    // 4) Save generated course in coursesTable
    // NOTE: coursesTable.courseJson is json(), so store an object, not a string.
    const images = ["/hello.jpg", "/word.jpg", "/letters.jpg", "/placeholder.png"];
    const bannerImageUrl = images[Math.floor(Math.random() * images.length)];

    await db.insert(coursesTable).values({
      cid: courseId,
      userEmail,
      preferenceId,

      // store display fields (use Gemini output first, fall back to preference inputs)
      name:
        course?.name ||
        `${formData.targetLanguage || "Language"} for ${formData.interests || "Everyday Use"}`,
      description: course?.description || formData.goal || "",
      noOfChapters: computedNoOfChapters,
      includeVideo: Boolean(course?.includeVideo ?? formData.includeVideo),
      level: computedLevel,
      category: course?.category || formData.interests || "Language Learning",

      // store the generated structure
      courseJson: course, // json column
      courseContent: course, // optional, but you already have it in schema
      bannerImageUrl,
    });

    // keep the same response your tutorial expects
    return NextResponse.json({ courseId });
  } catch (err) {
    console.error("POST /api/generate-course-layout ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}