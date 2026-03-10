import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import EnrollCourseList from './_components/EnrollCourseList'

function Workspace() {
  return (
    <div className="p-6 md:p-8 space-y-10">

      <div className="rounded-2xl shadow-sm bg-white p-6">
        <WelcomeBanner/>

        <p className="text-gray-600 mt-4 text-sm md:text-base leading-relaxed">
          Welcome to <strong>Lorito</strong>, your AI-powered language learning platform.
          Lorito builds personalized lessons based on your interests, profession, and
          learning goals. Instead of following generic courses, you’ll explore vocabulary,
          grammar concepts, and real-world examples tailored specifically to you.
        </p>

        <p className="text-gray-500 mt-3 text-sm">
          Start a new course, continue learning where you left off, and reinforce your
          knowledge through interactive exercises like quizzes, matching, and fill-in-the-blank activities.
        </p>
      </div>

      <EnrollCourseList/>
      <CourseList/>

    </div>
  )
}

export default Workspace