"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '../../../@/components/ui/input'
import { Button } from '../../../@/components/ui/button'
import { Search } from 'lucide-react'
import { useUser } from '@clerk/nextjs';
import axios from 'axios'
import CourseCard from '../_components/CourseCard'
import { Skeleton } from '../../../@/components/ui/skeleton'

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useUser();

  useEffect(() => {
    GetCourseList();
  }, [user]);

  const GetCourseList = async () => {
    const result = await axios.get('/api/courses?courseId=0');
    console.log(result.data);
    setCourseList(result.data);
  };

  const OnSearch = () => {
    setSearchTerm(searchInput.trim().toLowerCase());
  };

  const filteredCourses = useMemo(() => {
    if (!searchTerm) return courseList;

    return courseList.filter((course) => {
      const courseJson = course?.courseJson?.course || course?.courseJson;

      const name = (course?.name || courseJson?.name || '').toLowerCase();
      const description = (course?.description || courseJson?.description || '').toLowerCase();
      const level = (course?.level || courseJson?.level || '').toLowerCase();
      const category = (course?.category || courseJson?.category || '').toLowerCase();

      return (
        name.includes(searchTerm) ||
        description.includes(searchTerm) ||
        level.includes(searchTerm) ||
        category.includes(searchTerm)
      );
    });
  }, [courseList, searchTerm]);

  return (
    <div>
      <h2 className='font-bold text-3xl mb-6'>Explore More Courses</h2>

      <div className='flex gap-5 max-w-md mb-10'>
        <Input
          placeholder="Search by language, level, topic..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              OnSearch();
            }
          }}
        />
        <Button onClick={OnSearch}>
          <Search /> Search
        </Button>
      </div>

      {searchTerm ? (
        <p className='text-sm text-gray-500 mb-6'>
          Showing {filteredCourses.length} result{filteredCourses.length !== 1 ? 's' : ''} for "{searchTerm}"
        </p>
      ) : null}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
        {courseList.length > 0 ? (
          filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <CourseCard course={course} key={index} />
            ))
          ) : (
            <div className='col-span-full text-gray-500'>
              No courses matched your search.
            </div>
          )
        ) : (
          [0, 1, 2, 3].map((item, index) => (
            <Skeleton key={index} className='w-full h-[240px] rounded-xl' />
          ))
        )}
      </div>
    </div>
  )
}

export default Explore