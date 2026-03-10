import { coursesTable, usersTable } from "../../../config/schema";
import { db } from "../../../config/db";
import {currentUser} from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import { desc, eq, ne, sql } from "drizzle-orm";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");
    const user = await currentUser();
  
    // Explore page: courseId=0 (string)
    if (courseId == "0") {
      const result = await db
        .select()
        .from(coursesTable)
        .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`);
  
      return NextResponse.json(result);
    }
    // Single course detail
    else if (courseId) {
      const result = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId));
  
      return NextResponse.json(result[0]);
    }
    // User's courses
    else {
      const result = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.userEmail, user?.primaryEmailAddress?.emailAddress));
  
      return NextResponse.json(result);
    }
  }