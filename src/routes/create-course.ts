import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";

export async function createCourse(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    logger.debug("Endpoint createCourse called");
    const data = request.body;

    if (!data) {
      response.status(400).json({
        httpStatusCode: 400,
        message: "Invalid request body. The body provided is empty",
      });
    }

    const course = await AppDataSource.manager.transaction(
      "REPEATABLE READ",
      async (transactionalEntityManager) => {
        const repository = transactionalEntityManager.getRepository("Course");
        const maxSeqNo = await repository
          .createQueryBuilder("courses")
          .select("MAX(courses.seqNo)", "max")
          .getRawOne();

        const course = repository.create({
          ...data,
          seqNo: (maxSeqNo?.max ?? 0) + 1,
        });

        await repository.save(course);
        return course;
      }
    );

    response.status(201).json({ course });

  } catch (err) {
    logger.error("Error occurred while creating course", err);
    next(err);
  }
}
