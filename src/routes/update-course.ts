import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { isNumber } from "../utils";
import { AppDataSource } from "../data-source";
import { Course } from "../model/course";

export async function updateCourse(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug("Endpoint updateCourse called");

    const courseId = request.params.courseId;
    const changes = request.body;

    if (!isNumber(courseId)) {
      throw new Error("Invalid course id");
    }

    await AppDataSource.createQueryBuilder()
      .update(Course)
      .set(changes)
      .where("id = :courseId", { courseId })
      .execute();

    response.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    logger.error("Error occurred while updating course");
    return next(error);
  }
}
