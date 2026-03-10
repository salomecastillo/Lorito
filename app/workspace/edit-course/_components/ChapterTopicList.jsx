import { Gift } from 'lucide-react';
import React from 'react'

function ChapterTopicList({ course }) {
  const raw = course?.courseJson;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  const courseLayout = parsed?.course ? parsed.course : parsed;

  const getTopicTitle = (topic) => {
    if (typeof topic === 'string') return topic;
    return topic?.topicTitle || topic?.topic || topic?.title || 'Untitled Topic';
  };

  return (
    <div>
      <h2 className='font-bold text-3xl mt-10'>Chapters & Topics</h2>

      <div className='flex flex-col items-center justify-center mt-10'>
        {courseLayout?.chapters?.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className='flex flex-col items-center'>
            <div className='p-4 border shadow rounded-xl bg-primary text-white'>
              <h2 className='text-center'>Chapter {chapterIndex + 1}</h2>
              <h2 className='font-bold text-lg text-center'>{chapter?.chapterName}</h2>
              <h2 className='text-xs flex justify-between gap-16'>
                <span>Duration: {chapter?.duration || 'Varies'}</span>
                <span>No. Of Topics: {chapter?.topics?.length || 0}</span>
              </h2>
            </div>

            <div>
              {chapter?.topics?.map((topic, topicIndex) => {
                const title = getTopicTitle(topic);

                return (
                  <div className='flex flex-col items-center' key={topicIndex}>
                    <div className='h-10 bg-gray-300 w-1'></div>

                    <div className='flex items-center gap-5'>
                      <span className={`${topicIndex % 2 === 0 ? '' : 'text-transparent'} max-w-xs`}>
                        {title}
                      </span>

                      <h2 className='text-center rounded-full bg-gray-300 px-6 text-gray-500 p-4'>
                        {topicIndex + 1}
                      </h2>

                      <span className={`${topicIndex % 2 !== 0 ? '' : 'text-transparent'} max-w-xs`}>
                        {title}
                      </span>
                    </div>

                    {topicIndex === chapter?.topics?.length - 1 && (
                      <>
                        <div className='h-10 bg-gray-300 w-1'></div>
                        <div className='flex items-center gap-5'>
                          <Gift className='text-center rounded-full bg-gray-300 h-14 w-14 text-gray-500 p-4' />
                        </div>
                        <div className='h-10 bg-gray-300 w-1'></div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className='p-4 border shadow rounded-xl bg-green-600 text-white'>
          <h2>Finish</h2>
        </div>
      </div>
    </div>
  )
}

export default ChapterTopicList