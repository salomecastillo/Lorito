import { db } from "../../../config/db";
import { and, eq, desc } from "drizzle-orm";
import { coursesTable, enrollCourseTasble } from "../../../config/schema";
import {currentUser} from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export async function POST (req){
    const {courseId}=await req.json();
    const user = await currentUser();

    //if course is already enrolled 
    const enrollCourses=await db.select().from(enrollCourseTasble)
    .where(and(eq(enrollCourseTasble.userEmail, user?.primaryEmailAddress.emailAddress),
    eq(enrollCourseTasble.cid, courseId)))

    if(enrollCourses?.length == 0){
        const result=await db.insert(enrollCourseTasble).values({
            cid: courseId,
            userEmail: user.primaryEmailAddress?.emailAddress
        }).returning(enrollCourseTasble)

        return NextResponse.json(result);
    }
    return NextResponse.json({'resp': 'Already Enrolled'})
}

export async function GET(req) {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");
  
    if (courseId) {
      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTasble, eq(coursesTable.cid, enrollCourseTasble.cid))
        .where(
          and(
            eq(enrollCourseTasble.userEmail, user?.primaryEmailAddress.emailAddress),
            eq(enrollCourseTasble.cid, courseId)
          )
        );
  
      return NextResponse.json(result[0]);
    } else {
      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTasble, eq(coursesTable.cid, enrollCourseTasble.cid))
        .where(eq(enrollCourseTasble.userEmail, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(enrollCourseTasble.id));
  
      return NextResponse.json(result);
    }
  }

export async function PUT(req){
    const{completedChapters, courseId}=await req.json();
    const user=await currentUser();
    
    const result=await db.update(enrollCourseTasble).set({
        completedChapters:completedChapters
    }).where(and(eq(enrollCourseTasble.cid, courseId),
        eq(enrollCourseTasble.userEmail, user?.primaryEmailAddress?.emailAddress)))
        .returning(enrollCourseTasble)

        return NextResponse.json(result);
}