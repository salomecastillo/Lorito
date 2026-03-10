"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '../../../../@/components/ui/input'
import { Button } from '../../../../@/components/ui/button'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { CheckCircle2, Sparkles, PencilLine } from 'lucide-react'

function FillTheBlank() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  const questions = topic?.practice?.fillInTheBlank || [];
  const question = questions?.[currentQuestionIndex];

  const CheckAnswer = () => {
    setShowResult(true);
  };

  const IsCorrect = () => {
    return userAnswer?.trim().toLowerCase() == question?.answerTarget?.trim().toLowerCase();
  };

  const NextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setUserAnswer('');
    setShowResult(false);
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress =
    questions.length > 0
      ? Math.round(((currentQuestionIndex + (showResult && IsCorrect() ? 1 : 0)) / questions.length) * 100)
      : 0;

  return (
    <div className='min-h-screen w-full  px-4 py-8 md:px-8'>
      <div className='mx-auto max-w-5xl'>
        {/* Header */}
        <div className='mb-8 overflow-hidden rounded-[28px] border border-orange-200/60 bg-white/80 shadow-xl backdrop-blur'>
          <div className='bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 p-[1px]'>
            <div className='rounded-[27px] bg-white/95 p-6 md:p-8'>
              <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
                <div>
                  <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700'>
                    <Sparkles className='h-4 w-4' />
                    Fill in the Blank
                  </div>

                  <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-gray-900'>
                    Complete the Sentence
                  </h2>

                  <p className='mt-2 max-w-2xl text-sm md:text-base text-gray-600'>
                    {question?.promptNative || 'Read the sentence and type the correct answer in the blank.'}
                  </p>
                </div>

                <div className='min-w-[170px] rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 px-5 py-4 text-center shadow-sm'>
                  <p className='text-xs uppercase tracking-[0.2em] text-gray-500'>Progress</p>
                  <h3 className='mt-1 text-3xl font-bold text-orange-600'>{progress}%</h3>
                  <p className='text-sm text-gray-600'>
                    {Math.min(currentQuestionIndex + 1, questions.length)}/{questions.length} question
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
            <PencilLine className='h-4 w-4' />
            Prompt
          </div>

          <h2 className='text-xl font-bold text-gray-900 md:text-2xl'>
            {question?.promptTarget}
          </h2>

          <p className='mt-3 text-sm md:text-base text-gray-600'>
            {question?.promptNative}
          </p>

          <div className='mt-6 rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-6 shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-800 md:text-xl'>
              {question?.sentenceWithBlankTarget}
            </h2>
          </div>
        </div>

        {/* Answer Card */}
        <div className='rounded-[28px] border border-orange-200/60 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700'>
            <CheckCircle2 className='h-4 w-4' />
            Answer Section
          </div>

          <h2 className='text-lg font-bold text-gray-900'>Type your answer below</h2>

          <Input
            placeholder={'Input Your Answer Here'}
            className='mt-6 h-14 rounded-2xl border-orange-200 bg-orange-50/40 px-5 text-base focus-visible:ring-orange-400'
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              setShowResult(false);
            }}
          />

          <div className='mt-6 flex flex-col items-start gap-4'>
            <Button
              onClick={CheckAnswer}
              className='w-full rounded-2xl bg-primary px-8 py-6 text-base font-semibold text-white shadow-md hover:opacity-95 md:w-auto'
            >
              Check Answer
            </Button>

            {showResult ? (
              <div className='w-full'>
                <div
                  className={`rounded-2xl border px-5 py-4 text-base font-semibold shadow-sm ${
                    IsCorrect()
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {IsCorrect() ? 'Correct' : 'Incorrect'}
                </div>

                <div className='mt-4 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 px-5 py-4 text-sm text-gray-700 shadow-sm'>
                  <p>
                    <span className='font-semibold text-gray-900'>Correct Answer:</span>{' '}
                    {question?.answerTarget}
                  </p>

                  {question?.answerNative ? (
                    <p className='mt-2'>
                      <span className='font-semibold text-gray-900'>Meaning:</span>{' '}
                      {question?.answerNative}
                    </p>
                  ) : null}
                </div>

                {IsCorrect() && !isLastQuestion ? (
                  <Button
                    className='mt-5 rounded-2xl px-6 py-5 text-base font-semibold'
                    onClick={NextQuestion}
                  >
                    Next Question
                  </Button>
                ) : null}

                {IsCorrect() && isLastQuestion ? (
                  <div className='mt-5 rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 px-6 py-5 text-center shadow-sm'>
                    <h2 className='text-lg font-bold text-orange-700'>
                      You finished all the fill in the blank questions!
                    </h2>
                    <p className='mt-1 text-sm text-gray-600'>
                      Nice work completing this activity.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FillTheBlank