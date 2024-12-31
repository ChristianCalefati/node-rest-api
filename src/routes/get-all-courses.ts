import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../model/course";

export async function getAllCourses(request: Request, response: Response) {
  console.log("GET api/courses endpoint called");

  const courses = await AppDataSource.getRepository(Course)
    .createQueryBuilder("courses")
    .leftJoinAndSelect("courses.lessons", "lessons")
    .orderBy("courses.seqNo", "ASC")
    .getMany();

    response.status(200).json({courses});
}
