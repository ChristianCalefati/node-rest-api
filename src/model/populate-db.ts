import * as dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.log("Error loading environment variables, aborting....");
  process.exit(1);
}

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { COURSES } from "./data-db";
import { DeepPartial } from "typeorm";
import { Course } from "./course";
import { Lesson } from "./lesson";

async function populateDb() {
  await AppDataSource.initialize();
  console.log("Database connection ready");

  const courses = Object.values(COURSES) as DeepPartial<Course>[];

  const courseRepository = AppDataSource.getRepository(Course);
  const lessonRepository = AppDataSource.getRepository(Lesson);

  for (let courseData of courses) {
    //Store courses data
    console.log(`Inserting course  ${courseData.title}`);
    const course = courseRepository.create(courseData);
    await courseRepository.save(course);

    //Store lessons data and link it to the course
    for (let lessonData of course.lessons) {
      console.log(
        `Inserting lesson ${lessonData.seqNo} for course ${course.title}`
      );
      const lesson = lessonRepository.create(lessonData);
      lesson.course = course;
      await lessonRepository.save(lesson);
    }

    const totalCourses = await courseRepository.count();
    const totalLessons = await lessonRepository.count();

    console.log(`Total courses stored: ${totalCourses}`);
    console.log(`Total lessons stored: ${totalLessons}`);
  }
}

populateDb()
  .then(() => {
    console.log("Finished populating Database. exiting...");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error populating Database", err);
    process.exit(1);
  });
