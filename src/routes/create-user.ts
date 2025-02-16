import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { HttpError } from "../middlewares/default-error-handler";
import { AppDataSource } from "../data-source";
import { User } from "../model/user";
import { calculatePasswordHash } from "../utils";

const crypto = require("crypto");

export async function createUser(request: Request, response: Response, next: NextFunction) {

    try {
        const userRepository = AppDataSource.getRepository(User);
        logger.debug("Called createUser()");
        const { email, password, isAdmin, pictureUrl } = request.body;

        if (!email) {
            const httpError: HttpError = { status: 400, message: "Email is required" }
            return next(httpError);
        }

        if (!password) {
            const httpError: HttpError = { status: 400, message: "Password is required" }
            return next(httpError);
        }

        //Check if the user is already present.
        const existingUser = await userRepository.findOneBy({email: email});
        if(existingUser) {
            const httpError: HttpError = { status: 400, message: "User already exists" }
            return next(httpError);
        }

        const passwordSalt = crypto.randomBytes(64).toString("hex");
        const passwordHash = await calculatePasswordHash(password, passwordSalt);
        const userEntity = userRepository.create({
            email,
            passwordSalt,
            passwordHash,
            isAdmin,
            pictureUrl
        });

       await  userRepository.save(userEntity);
       response.status(201).json({
            email,
            isAdmin,
            pictureUrl
       });

    }
    catch (err) {
        logger.error(`Error occurred while creating user`, err);
        const httpError: HttpError = { status: 500, message: "Error occurred while creting user", error: err }
        next(httpError);
    }

}