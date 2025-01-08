import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

export async function getCourseByUrl(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug("Endpoint getCourseByUrl called");

    const courseUrl = request.params.courseUrl;
    if (!courseUrl) {
      throw new Error("courseUrl could not be extracted from the request");
    }

    const course = await AppDataSource.getRepository(Course).findOneBy({
      url: courseUrl,
    });

    if (!course) {
      logger.warning(`Course with url ${courseUrl} not found`);
      response.status(404).send({
        httpStatusCode: 404,
        message: `Course with url ${courseUrl} not found`,
      });
      return;
    }

    const totalLessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder("lessons")
      .where("lessons.courseId = :courseId", { courseId: course.id })
      .getCount();

    response.status(200).json({ course, totalLessons });
  } catch (error) {
    logger.error("Error occurred while fetching course by url");
    next(error);
  }
}
