import { db } from "../../../config/db";
import { eq } from "drizzle-orm";
import { usersTable } from "../../../config/schema";
import { NextResponse } from "next/server"; // next.js helper used for HTTP responses

export async function POST(req){// async function running whenever a POST request occurs
    const{email, name} = await req.json();// take the email and name from user req

    //USER ALREADY EXISTS
    const users=await db.select().from(usersTable).where(eq(usersTable.email,email));// check if email in database(db) matches posted

    //IF NOT, INSERT NEW USER
    if(users?.length==0){// no user found
        const result=await db.insert(usersTable).values({
            name: name,
            email: email
        }).returning(usersTable);// add new user using this data
        
        console.log(result);//testing purpose
        return NextResponse.json(result) //send user back as our response
    }
    return NextResponse.json(users[0]) // send back response in JSON formatting
}