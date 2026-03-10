import { boolean } from "drizzle-orm/gel-core";
import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", { // constant called user table used to access throughout program
  //columns in our table and their values/types/etc
  id: integer().primaryKey().generatedAlwaysAsIdentity(), //this will be auto created 
  name: varchar({ length: 255 }).notNull(), // value is required must be provided 
  email: varchar({ length: 255 }).notNull().unique(),
});

export const coursesTable=pgTable("courses",{
  id: integer().primaryKey().generatedAlwaysAsIdentity(), //this will be auto created 
  cid:varchar().notNull().unique(),
  name:varchar(),
  description:varchar(),
  noOfChapters:integer().notNull(),
  includeVideo:boolean().default(false),
  level:varchar().notNull(),
  category:varchar(),
  courseJson:json(),
  bannerImageUrl:varchar().default(''),
  courseContent: json().default({}),
  preferenceId: integer().references(() => preferencesTable.id),
  userEmail:varchar('userEmail').references(()=>usersTable.email).notNull()//takes the value from our other table 
})

export const preferencesTable=pgTable('preferencesTable',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(), //this will be auto created 
  cid:varchar().notNull(),
  //Native Language
  nativeLanguage:varchar().notNull(),
  //Target Language
  targetLanguage:varchar().notNull(),
  //Proficiency Level
  level:varchar().notNull(),
  //Profession / Hobby / Interest
  interests:varchar(),
  //Learning Goal
  goal:varchar(),
  //Course Length
  courseLength:integer().notNull(),
  userEmail:varchar('userEmail').references(()=>usersTable.email).notNull()//takes the value from our other table 
})

export const enrollCourseTasble=pgTable('enrollCourse',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(), //this will be auto created 
  cid: varchar('cid').references(() => coursesTable.cid),
  userEmail:varchar('userEmail').references(()=>usersTable.email).notNull(),//takes the value from our other table 
  completedChapters:json(),
})

