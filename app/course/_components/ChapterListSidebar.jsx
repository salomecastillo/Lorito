import React, { useContext } from 'react'
import{
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../@/components/ui/accordion'
import { SelectedChapterIndexContext } from '../../../context/SelectedChapterIndexContext';
import { CheckCircle } from 'lucide-react';

function safeParseJson(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.log("Failed to parse JSON:", value);
    return null;
  }
}

function normalizeCourseObject(raw) {
  // supports both shapes:
  // { course: {...} }  (older)
  // { ... }            (newer)
  if (!raw) return null;
  return raw?.course ? raw.course : raw;
}

function normalizeChapters(courseInfo) {
  // 1) Try courseContent if it's already an array of chapters
  const rawCourseContent = courseInfo?.courses?.courseContent;
  const parsedCourseContent = safeParseJson(rawCourseContent);

  if (Array.isArray(parsedCourseContent)) {
    return parsedCourseContent; // already chapter array
  }

  // 2) Otherwise fall back to courseJson.chapters
  const rawCourseJson = courseInfo?.courses?.courseJson;
  const parsedCourseJson = safeParseJson(rawCourseJson);
  const courseObj = normalizeCourseObject(parsedCourseJson);

  const chapters = courseObj?.chapters ?? [];
  return Array.isArray(chapters) ? chapters : [];
}

function getTopicTitle(topic) {
  if (!topic) return '';
  if (typeof topic === 'string') return topic;

  // support different keys based on your schema
  return topic?.topicTitle || topic?.topic || topic?.title || '';
}

function ChapterListSidebar({ courseInfo }) {
  const enrollCourse = courseInfo?.enrollCourse;

  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);

  const completedChapter = enrollCourse?.completedChapters ?? [];

  // ✅ Always an array now
  const chapters = normalizeChapters(courseInfo);

  return (
    <div className='w-80 bg-secondary h-screen p-5'>
      <h2 className='my-3 font-bold text-xl'>Chapters ({chapters.length})</h2>

      <Accordion type="single" collapsible>
        {chapters.map((chapter, index) => (
          <AccordionItem
            value={chapter?.chapterName || `chapter-${index}`}
            key={index}
            onClick={() => setSelectedChapterIndex(index)}
          >
            <AccordionTrigger className={'text-lg font-medium py-5'}>
              <span className="mr-2">
                {!completedChapter.includes(index) ? index + 1 : <CheckCircle className='text-green-700' />}
              </span>
              {chapter?.chapterName}
            </AccordionTrigger>

            <AccordionContent asChild>
              <div>
                {(chapter?.topics ?? []).map((topic, index_) => (
                  <h2
                    key={index_}
                    className={`p-3 my-1 rounded-lg
                      ${completedChapter.includes(index) ? 'bg-green-100 text-green-800' : 'bg-white'}`}
                  >
                    {getTopicTitle(topic)}
                  </h2>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default ChapterListSidebar