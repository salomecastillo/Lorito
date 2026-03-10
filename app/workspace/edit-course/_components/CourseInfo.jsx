import { Book, Clock, Loader2Icon, PlayCircle, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../../../../@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

function CourseInfo({ course, viewCourse }) {
  function safeParseJson(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log("Failed to parse courseJson:", str);
      return null;
    }
  }

  const raw = course?.courseJson;
  const parsed = typeof raw === "string" ? safeParseJson(raw) : raw;
  const courseLayout = parsed?.course ? parsed.course : parsed;

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onStartLearning = async () => {
    try {
      setLoading(true);

      // enroll first so the rest of your app works (my-learning, etc.)
      const result = await axios.post('/api/enroll-course', {
        courseId: course?.cid,
      });

      // tutorial-style: if already enrolled, resp flag may exist
      if (result?.data?.resp) {
        toast.warning('Already Enrolled!');
      } else {
        toast.success('Enrolled!');
      }

      setLoading(false);
      router.push('/course/' + course?.cid);
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast.error('Server side error');
    }
  };

  return (
    <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow'>
      <div className='flex flex-col gap-3'>
        <h2 className='font-bold text-3xl'>{course?.name}</h2>
        <p className='line-clamp-2 text-gray-500'>{course?.description}</p>

        <div className='grid grid-cols-1 md:grid-cols-3'>
          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <Clock className='text-blue-500' />
            <section>
              <h2 className='font-bold'>Duration</h2>
              <h2>Varies</h2>
            </section>
          </div>

          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <Book className='text-green-500' />
            <section>
              <h2 className='font-bold'>Chapters</h2>
              <h2>{courseLayout?.noOfChapters ?? course?.noOfChapters ?? 0}</h2>
            </section>
          </div>

          <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
            <TrendingUp className='text-red-500' />
            <section>
              <h2 className='font-bold'>Difficulty Level</h2>
              <h2>{course?.level}</h2>
            </section>
          </div>
        </div>

        {!viewCourse ? (
          <Button className={'max-w'} onClick={onStartLearning} disabled={loading}>
            {loading ? <Loader2Icon className='animate-spin' /> : <PlayCircle />} Start Learning
          </Button>
        ) : (
          <Link href={'/course/' + course?.cid}>
            <Button>
              <PlayCircle /> Continue Learning
            </Button>
          </Link>
        )}
      </div>

      <Image
        src={course?.bannerImageUrl || "/placeholder.png"}
        alt={'Banner Image'}
        width={400}
        height={400}
        className='w-full mt-5 md:mt-0 object-cover aspect-auto h-[240px] rounded-2xl'
      />
    </div>
  );
}

export default CourseInfo;