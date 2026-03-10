"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '../../../../@/components/ui/button'
import { CheckCircle2, Sparkles } from 'lucide-react'

function Matching() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [selectedLeft, setSelectedLeft] = useState();
  const [selectedRight, setSelectedRight] = useState();
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [message, setMessage] = useState('');
  const [rightItems, setRightItems] = useState([]);

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
  const question = topic?.practice?.matching?.[0];
  const pairs = question?.pairs || [];

  useEffect(() => {
    if (pairs.length > 0) {
      const shuffled = [...pairs].sort(() => Math.random() - 0.5);
      setRightItems(shuffled);
    }
  }, [question]);

  const CheckMatch = () => {
    if (!selectedLeft || !selectedRight) return;

    if (selectedLeft.rightNative === selectedRight.rightNative) {
      setMatchedPairs((prev) => [...prev, selectedLeft.leftTarget]);
      setMessage('Correct Match!');
    } else {
      setMessage('Incorrect Match');
    }

    setSelectedLeft(undefined);
    setSelectedRight(undefined);
  };

  const IsMatched = (leftTarget) => {
    return matchedPairs.includes(leftTarget);
  };

  const completedAll = pairs.length > 0 && matchedPairs.length === pairs.length;
  const progress = pairs.length > 0 ? Math.round((matchedPairs.length / pairs.length) * 100) : 0;

  return (
    <div className='min-h-screen w-full px-4 py-8 md:px-8 '>
      <div className='mx-auto max-w-7xl'>
        {/* Header Card */}
        <div className='mb-8 rounded-3xl border border-primary/10 bg-gradient-to-br from-secondary via-background to-secondary shadow-lg p-6 md:p-8'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
                <Sparkles className='h-4 w-4' />
                Matching Activity
              </div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
                Match the Terms
              </h2>
              <p className='mt-2 text-sm md:text-base text-muted-foreground max-w-2xl'>
                {question?.instructionsNative || 'Match each term with its correct meaning.'}
              </p>
            </div>

            <div className='min-w-[160px] rounded-2xl bg-background/80 border border-primary/10 px-5 py-4 text-center shadow-sm'>
              <p className='text-xs uppercase tracking-wide text-muted-foreground'>Progress</p>
              <h3 className='mt-1 text-2xl font-bold text-primary'>{progress}%</h3>
              <p className='text-sm text-muted-foreground'>
                {matchedPairs.length}/{pairs.length} matched
              </p>
            </div>
          </div>
        </div>

        {/* Matching Board */}
        <div className='rounded-3xl border border-primary/10 bg-background shadow-xl p-4 md:p-6'>
          <div className='mb-6 grid grid-cols-2 gap-4'>
            <div className='rounded-2xl bg-primary/5 px-4 py-3 text-center font-semibold text-primary'>
              Terms
            </div>
            <div className='rounded-2xl bg-primary/5 px-4 py-3 text-center font-semibold text-primary'>
              Meanings
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6'>
            {/* Left side */}
            <div className='flex flex-col gap-4'>
              {pairs.map((pair, index) => (
                !IsMatched(pair.leftTarget) ? (
                  <button
                    key={index}
                    onClick={() => setSelectedLeft(pair)}
                    className={`min-h-[96px] rounded-2xl border text-left px-5 py-4 transition-all duration-200 shadow-sm
                      ${selectedLeft?.leftTarget === pair.leftTarget
                        ? 'border-primary bg-primary text-primary-foreground shadow-md scale-[1.01]'
                        : 'border-border bg-secondary/40 hover:border-primary/40 hover:bg-secondary'
                      }`}
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-base md:text-lg font-medium'>
                        {pair.leftTarget}
                      </span>
                      {selectedLeft?.leftTarget === pair.leftTarget ? (
                        <CheckCircle2 className='h-5 w-5 shrink-0' />
                      ) : null}
                    </div>
                  </button>
                ) : null
              ))}
            </div>

            {/* Right side */}
            <div className='flex flex-col gap-4'>
              {rightItems.map((pair, index) => (
                !IsMatched(pair.leftTarget) ? (
                  <button
                    key={index}
                    onClick={() => setSelectedRight(pair)}
                    className={`min-h-[96px] rounded-2xl border text-left px-5 py-4 transition-all duration-200 shadow-sm
                      ${selectedRight?.rightNative === pair.rightNative
                        ? 'border-primary bg-primary text-primary-foreground shadow-md scale-[1.01]'
                        : 'border-border bg-secondary/40 hover:border-primary/40 hover:bg-secondary'
                      }`}
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <span className='text-base md:text-lg font-medium'>
                        {pair.rightNative}
                      </span>
                      {selectedRight?.rightNative === pair.rightNative ? (
                        <CheckCircle2 className='h-5 w-5 shrink-0' />
                      ) : null}
                    </div>
                  </button>
                ) : null
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className='mt-8 flex flex-col items-center gap-4'>
            <Button
              className='w-full md:w-auto px-8 py-6 rounded-2xl text-base font-semibold'
              onClick={CheckMatch}
              disabled={!selectedLeft || !selectedRight}
            >
              Check Match
            </Button>

            {message ? (
              <h2
                className={`text-base font-semibold ${
                  message === 'Correct Match!'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {message}
              </h2>
            ) : null}

            {completedAll ? (
              <div className='rounded-2xl border border-primary/20 bg-primary/10 px-6 py-4 text-center'>
                <h2 className='font-bold text-primary text-lg'>
                  You matched everything!
                </h2>
                <p className='text-sm text-muted-foreground mt-1'>
                  Great job finishing this activity.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Matching