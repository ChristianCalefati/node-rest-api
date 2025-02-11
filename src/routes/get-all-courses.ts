import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../model/course";
import { logger } from "../logger";

export async function getAllCourses(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    console.log("GET api/courses endpoint called");

    //throw { error: "An Error occurred" };

    const courses = await AppDataSource.getRepository(Course)
      .createQueryBuilder("courses")
      .leftJoinAndSelect("courses.lessons", "lessons")
      .orderBy("courses.seqNo", "ASC")
      .getMany();

    response.status(200).json({ courses });
  } catch (error) {
    logger.error("Error occurred while fetching courses");
    const httpError = { status: 500, message: "Internal Server Error occurred", error };
    next(httpError);
  }
}
