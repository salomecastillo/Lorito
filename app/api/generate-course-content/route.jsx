// app/api/generate-course-content/route.jsx

import { NextResponse } from "next/server";
import { OpenRouter } from "@openrouter/sdk";
import { db } from "../../../config/db";
import { eq } from "drizzle-orm";
import { coursesTable } from "../../../config/schema";

const PROMPT = `Depends on Chapter name and Topic Generate content for each topic in HTML
and give response in JSON format.
Schema:{chapterName:<>,{topic:<>,content:<>}}: User Input:`;

export async function POST(req) {
  try {
    const { course, courseTitle, courseId } = await req.json(); // read request and take the course info 

    //open router api calling 
    const openrouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const promises = course?.chapters?.map(async (chapter) => { //array that ai requests
        const response = await openrouter.chat.send({
          // ✅ SDK expects params inside chatGenerationParams
          chatGenerationParams: {
            model: "stepfun/step-3.5-flash:free",
            messages: [
              {
                role: "user",
                content: PROMPT + JSON.stringify(chapter),
              },
            ],
            stream: false,
          },
        });

        const rawResp = response?.choices?.[0]?.message?.content;//fetch raw text from ai

        if (!rawResp) {
          throw new Error("OpenRouter returned empty response.");// if ai didnt work
        }

        console.log("RAW:", rawResp);

        const rawJson = rawResp.replace(/```json\s*|```/g, "").trim();//remove the json blocking if ai added it
        const jsonResp = JSON.parse(rawJson); // convert cleaned text into a real json

        return jsonResp;
      }) || [];

    const CourseContent = await Promise.all(promises);// wait until all the content has been generated 

    //save to db
    const dbResp=await db.update(coursesTable).set({
        courseContent: CourseContent,
    }).where(eq(coursesTable.cid, courseId));

    return NextResponse.json({//send this to frontend
      courseName: courseTitle,
      courseContent: CourseContent,
      courseId: courseId,
    });
  } catch (err) {
    console.error("POST /api/generate-course-content ERROR:", err);

    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}