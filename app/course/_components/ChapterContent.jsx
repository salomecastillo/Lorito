"use client";

import React, { useContext, useMemo, useState } from "react";
import { SelectedChapterIndexContext } from "../../../context/SelectedChapterIndexContext";
import { Button } from "../../../@/components/ui/button";
import { CheckCircle, X, Loader2Icon } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

function ChapterContent({ courseInfo, refreshData }) {
  const { courseId } = useParams();
  const { enrollCourse } = courseInfo || {};
  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);

  const courseLayout = useMemo(() => {
    const raw = courseInfo?.courses?.courseJson;
    if (!raw) return null;

    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed?.course ? parsed.course : parsed;
  }, [courseInfo]);

  const chapters = courseLayout?.chapters || [];
  const selectedChapter = chapters?.[selectedChapterIndex];
  const topics = selectedChapter?.topics || [];

  let completedChapter = enrollCourse?.completedChapters ?? [];
  const [loading, setLoading] = useState(false);

  const markChapterCompleted = async () => {
    try {
      setLoading(true);

      if (!completedChapter.includes(selectedChapterIndex)) {
        completedChapter = [...completedChapter, selectedChapterIndex];
      }

      await axios.put("/api/enroll-course", {
        courseId,
        completedChapters: completedChapter,
      });

      refreshData?.();
      toast.success("Chapter Marked Completed");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const markChapterIncomplete = async () => {
    try {
      setLoading(true);

      const updated = completedChapter.filter(
        (item) => item !== selectedChapterIndex
      );

      await axios.put("/api/enroll-course", {
        courseId,
        completedChapters: updated,
      });

      refreshData?.();
      toast.success("Chapter Marked Incomplete");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">
          {selectedChapterIndex + 1}. {selectedChapter?.chapterName}
        </h2>

        {completedChapter?.includes(selectedChapterIndex) ? (
          <Button variant="outline" onClick={markChapterIncomplete} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : <X className="mr-2" />}
            Mark Incomplete
          </Button>
        ) : (
          <Button onClick={markChapterCompleted} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : <CheckCircle className="mr-2" />}
            Mark as Completed
          </Button>
        )}
      </div>

      {/* Activity Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/workspace/multiple-choice/${courseId}`}>
          <Button variant="outline">Multiple Choice</Button>
        </Link>

        <Link href={`/workspace/fill-the-blank/${courseId}`}>
          <Button variant="outline">Fill in the Blank</Button>
        </Link>

        <Link href={`/workspace/matching/${courseId}`}>
          <Button variant="outline">Matching</Button>
        </Link>

        <Link href={`/workspace/quiz/${courseId}`}>
          <Button variant="outline">Quiz</Button>
        </Link>
      </div>

      {/* Lesson Content */}
      <div className="mt-7">
        {topics.map((topic, index) => {
          const title = topic?.topicTitle || topic?.topic || `Topic ${index + 1}`;
          const lesson = topic?.conceptLesson || topic?.lesson;

          const vocab = lesson?.keyVocabulary || [];
          const rules = lesson?.keyRules || [];
          const examples = lesson?.examples || [];
          const mistakes = lesson?.commonMistakes || [];

          return (
            <div key={index} className="mt-10 p-5 bg-secondary rounded-2xl">
              <h2 className="font-bold text-2xl text-primary">
                {index + 1}. {title}
              </h2>

              {lesson?.explanationNative ? (
                <div className="mt-4 bg-white rounded-xl p-5">
                  <h3 className="font-semibold text-lg">Explanation</h3>
                  <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">
                    {lesson.explanationNative}
                  </p>

                  {lesson?.explanationTarget ? (
                    <p className="text-sm text-gray-500 mt-3 whitespace-pre-line">
                      {lesson.explanationTarget}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {lesson?.whyThisWorksNative ? (
                <div className="mt-4 bg-white rounded-xl p-5">
                  <h3 className="font-semibold text-lg">Why this works</h3>
                  <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">
                    {lesson.whyThisWorksNative}
                  </p>
                </div>
              ) : null}

              {rules.length ? (
                <div className="mt-4 bg-white rounded-xl p-5">
                  <h3 className="font-semibold text-lg">Key Rules</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-800">
                    {rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {examples.length ? (
                <div className="mt-4 bg-white rounded-xl p-5">
                  <h3 className="font-semibold text-lg">Examples</h3>
                  <div className="mt-3 space-y-3">
                    {examples.slice(0, 10).map((ex, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="text-sm font-medium">{ex?.exampleTarget}</div>
                        {ex?.exampleNative ? (
                          <div className="text-sm text-gray-500 mt-1">{ex.exampleNative}</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {vocab.length ? (
                <div className="mt-4 bg-white rounded-xl p-5">
                  <h3 className="font-semibold text-lg">Key Vocabulary</h3>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vocab.slice(0, 12).map((v, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="font-medium">{v?.target}</div>
                        <div className="text-sm text-gray-500">{v?.native}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChapterContent;