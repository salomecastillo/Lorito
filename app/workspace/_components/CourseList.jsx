"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Button } from '../../../@/components/ui/button';
import AddNewCourseDialog from './AddNewCourseDialog';
import CourseCard from './CourseCard'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

function CourseList() {
    const [courseList, setCourseList] = useState([]); // variables that will store the courses (start empty)
    const{user}=useUser();
    useEffect(()=>{
      GetCourseList();
    }, [user])
    const GetCourseList= async ()=>{
      const result=await axios.get('/api/courses');
      console.log(result.data);
      setCourseList(result.data)
    }
  return (
    <div className='mt-10'>
        <h2 className='font-bold text-3xl'>Course List</h2>
        {/*if there are NO courses show this content */}
        {courseList?.length==0? 
        <div className='flex p-7 items-center justify-center flex-col border rounded-xl mt-2 bg-secondary'>
            <Image src={'/online-education.png'} alt='edu' width={80} height={80}/>
            <h2 className='my-2 text-xl font-bold'>Looks like you haven't created any courses yet</h2>
            <AddNewCourseDialog><Button> + Create your first course</Button></AddNewCourseDialog>
        {/*Else show this content*/}
        </div>:
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'> 
            {courseList?.map((course, index)=>(
                <CourseCard course={course} key={index}/>
            ))}
        </div>}
    </div>
  )
}

export default CourseList