"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '../../../../@/components/ui/button'
import { CircleCheck, Sparkles, Trophy } from 'lucide-react'

function Quiz() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);

  useEffect(() => {
    GetCourse();
  }, []);

  const GetCourse = async () => {
    const result = await axios.get('/api/courses?courseId=' + courseId);
    console.log("API result", result.data);
    setCourse(result.data);
  };

  const courseJson = course?.courseJson?.course || course?.courseJson;
  const chapter = courseJson?.chapters?.[0];
  const topic = chapter?.topics?.[0];
  const quiz = topic?.practice?.quiz;

  const questions = quiz?.questions || [];
  const question = questions?.[currentQuestionIndex];
  const progress = questions.length > 0 ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0;

  const NextQuestion = () => {
    if (selectedOption == question?.answerIndex) {
      setScore(score + 1);
    }

    if (currentQuestionIndex == questions.length - 1) {
      setShowFinalScore(true);
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption(undefined);
  };

  const RestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(undefined);
    setScore(0);
    setShowFinalScore(false);
  };

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-orange-50 via-background to-amber-50 px-4 py-8 md:px-8'>
      <div className='mx-auto max-w-5xl'>
        {!showFinalScore ? (
          <>
            {/* Header */}
            <div className='mb-8 overflow-hidden rounded-[28px] border border-orange-200/60 bg-white/80 shadow-xl backdrop-blur'>
              <div className='bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 p-[1px]'>
                <div className='rounded-[27px] bg-white/95 p-6 md:p-8'>
                  <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
                    <div>
                      <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700'>
                        <Sparkles className='h-4 w-4' />
                        Quiz Activity
                      </div>

                      <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-gray-900'>
                        {quiz?.title}
                      </h2>

                      <p className='mt-2 text-sm md:text-base text-gray-600'>
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </p>
                    </div>

                    <div className='min-w-[170px] rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 px-5 py-4 text-center shadow-sm'>
                      <p className='text-xs uppercase tracking-[0.2em] text-gray-500'>Progress</p>
                      <h3 className='mt-1 text-3xl font-bold text-orange-600'>{progress}%</h3>
                      <p className='text-sm text-gray-600'>
                        {currentQuestionIndex + 1}/{questions.length} question
                      </p>
                    </div>
                  </div>

                  <div className='mt-5 h-3 w-full overflow-hidden rounded-full bg-orange-100'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 transition-all duration-300'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className='mb-6 rounded-[28px] border border-orange-200/60 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8'>
              <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700'>
                <Sparkles className='h-4 w-4' />
                Question
              </div>

              <h2 className='text-xl font-bold text-gray-900 md:text-2xl'>
                {question?.questionTarget}
              </h2>
            </div>

            {/* Options */}
            <div className='flex flex-col gap-4'>
              {question?.optionsTarget?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`w-full rounded-3xl border px-5 py-5 text-left transition-all duration-200
                    ${selectedOption == index
                      ? 'scale-[1.01] border-orange-500 bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg'
                      : 'border-orange-200 bg-white shadow-sm hover:-translate-y-[2px] hover:border-orange-300 hover:shadow-md'
                    }`}
                >
                  <div className='flex items-center justify-between gap-4'>
                    <span className='text-base font-semibold md:text-lg'>
                      {option}
                    </span>

                    {selectedOption == index ? (
                      <CircleCheck className='h-5 w-5 shrink-0' />
                    ) : (
                      <div className='h-3 w-3 rounded-full bg-orange-200' />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Action */}
            <div className='mt-8 flex justify-center md:justify-start'>
              <Button
                onClick={NextQuestion}
                disabled={selectedOption === undefined}
                className='w-full rounded-2xl bg-primary px-8 py-6 text-base font-semibold text-white shadow-md hover:opacity-95 md:w-auto'
              >
                {currentQuestionIndex == questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </>
        ) : (
          <div className='overflow-hidden rounded-[28px] border border-orange-200/60 bg-white/85 shadow-xl backdrop-blur'>
            <div className='bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 p-[1px]'>
              <div className='rounded-[27px] bg-white/95 p-8 md:p-10'>
                <div className='flex flex-col items-center text-center'>
                  <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 shadow-sm'>
                    <Trophy className='h-8 w-8' />
                  </div>

                  <h2 className='text-2xl font-bold text-gray-900 md:text-3xl'>
                    Quiz Complete!
                  </h2>

                  <h2 className='mt-4 text-xl font-semibold text-orange-600 md:text-2xl'>
                    Your Score: {score} / {questions.length}
                  </h2>

                  <p className='mt-3 max-w-2xl text-gray-600'>
                    {quiz?.scoreMessageNative}
                  </p>

                  <Button
                    className='mt-6 rounded-2xl px-6 py-5 text-base font-semibold'
                    onClick={RestartQuiz}
                  >
                    Restart Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz