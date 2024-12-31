import * as dotenv from "dotenv";

const result = dotenv.config();
if (result.error) {
  console.log("Error loading environment variables, aborting....");
  process.exit(1);
}

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Lesson } from "./lesson";
import { Course } from "./course";

async function cleanDb() {
  await AppDataSource.initialize();
  console.log("Database connection ready");

  const lessonRepository = AppDataSource.getRepository(Lesson);
  const courseRepository = AppDataSource.getRepository(Course);

  console.log("Deleting all lessons");
  await lessonRepository.delete({});
  console.log("Lessons deleted");
  console.log("Deleting all courses");
  await courseRepository.delete({});
  console.log("Courses deleted");
}

cleanDb()
  .then(() => {
    console.log("Database cleaned. Exiting...");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error cleaning Database", err);
    process.exit(1);
  });