import { PlayCircle } from 'lucide-react';
import Image from 'next/image'
import React from 'react'
import { Button } from '../../../@/components/ui/button';
import Link from 'next/link';
import { Progress } from '../../../@/components/ui/progress';

function EnrollCourseCard({course, enrollCourse}) {
  const courseJson = course?.courseJson?.course || course?.courseJson;

  const CalculatePerProgress = () => {
    const completed = enrollCourse?.completedChapters?.length ?? 0;
    const total = course?.noOfChapters ?? courseJson?.noOfChapters ?? 0;

    if (total === 0) return 0;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className='shadow rounded-xl'>
      <Image
        src={course?.bannerImageUrl}
        alt={course?.name}
        width={400}
        height={300}
        className='w-full aspect-video rounded-t-xl object-cover'
      />
      <div className='p-3 flex flex-col gap-3'>
        <h2 className='font-bold text-lg '>{course?.name ?? courseJson?.name}</h2>
        <p className='line-clamp-3 text-gray-400 text-sm'>
          {course?.description ?? courseJson?.description}
        </p>
        <div>
          <h2 className='flex justify-between text-sm text-primary'>
            Progress <span>{CalculatePerProgress()}%</span>
          </h2>
          <Progress value={CalculatePerProgress()} />

          <Link href={'/workspace/view-course/' + course?.cid}>
            <Button className='w-full mt-3'>
              <PlayCircle /> Continue Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EnrollCourseCard