import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { isNumber } from "../utils";
import { AppDataSource } from "../data-source";
import { Lesson } from "../model/lesson";

export async function findLessonsForCourse(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug("Endpoint findLessonsForCourse called");

    const courseId = request.params.courseId;
    const query = request.query as any;
    const page = query?.page ?? "0";
    const size = query?.size ?? "3";

    if (!isNumber(courseId)) {
      throw new Error("Invalid course id");
    }
    if (!isNumber(page)) {
      throw new Error("Invalid pageNr:" + page);
    }
    if (!isNumber(size)) {
      throw new Error("Invalid size:" + size);
    }

    const lessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder("lessons")
      .where("lessons.courseId = :courseId", { courseId })
      .orderBy("lessons.seqNo", "ASC")
      .skip(page * size)
      .take(size)
      .getMany();

    response.status(200).json({ lessons });
  } catch (error) {
    logger.error("Error occurred while fetching lessons for course");
    return next(error);
  }
}
