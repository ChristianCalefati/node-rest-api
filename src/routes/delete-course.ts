import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { isNumber } from "../utils";
import { AppDataSource } from "../data-source";
import { Lesson } from "../model/lesson";
import { Course } from "../model/course";
import { HttpError } from "../middlewares/default-error-handler";

export async function deleteCourseAndLessons(request: Request, response: Response, next: NextFunction) {

    try {
        logger.debug("Called deleteCourseAndLessons()");

        const courseId = request.params.courseId;

        //Check the consistency of courseId
        if (!isNumber(courseId)) {
            const error: HttpError = { status: 400, message: "Invalid course id" };
            return next(error);
        }

        console.log(`Deleting course with id ${courseId}`);

        //Check the existance of course with Id
        const course = await AppDataSource.getRepository(Course).findOneBy({ id: parseInt(courseId) });
        if(!course) {
            const httpError = {status: 404, message: `Course with id ${courseId} not found`};
            return next(httpError);
        }

        await AppDataSource.manager.transaction(
            async transactionaManager => {
                //Removes the lessons 
                await transactionaManager.createQueryBuilder()
                    .delete()
                    .from(Lesson)
                    .where("courseId = :courseId", { courseId })
                    .execute();

                //Removes the course
                await transactionaManager.createQueryBuilder()
                    .delete()
                    .from(Course)
                    .where("id = :courseId", { courseId })
                    .execute();
            }
        )

        response.status(200).json({ message: `Course with id ${courseId} and its lessons have been deleted` });

    } catch (err) {
        logger.error("Error deleting course and lessons: ", err);
        const httpError = { status: 500, message: "Internal Server Error occurred", error: err };
        next(httpError);
    }
}