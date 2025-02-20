import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { User } from "../model/user";
import { calculatePasswordHash } from "../utils";
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        logger.debug(`User login() called`);
        const userRepository = AppDataSource.getRepository(User);

        const { email, password } = req.body;

        if (!email) {
            res.status(400).send({ message: "Email is required" });
            return;
        }

        if (!password) {
            res.status(400).send({ message: "Password is required" });
            return;
        }

        const userEntity = await userRepository.findOneBy({ email });

        if (!userEntity) {
            const message = `Login denied`;
            logger.info(`${message} - ${email}`);
            res.status(403).json({ message });
            return;
        }

        const passwordHash = await calculatePasswordHash(password, userEntity.passwordSalt);

        if (passwordHash !== userEntity.passwordHash) {
            const message = `Login denied`;
            logger.info(`${message} - ${email} - User entered wrong password`);
            res.status(403).json({ message });
            return;
        }

        const { isAdmin, pictureUrl } = userEntity;

        // Create JWT token
        const jwtPayload = {
            userId: userEntity.id,
            email,
            isAdmin
        }

        const jwt = jsonwebtoken.sign(jwtPayload, JWT_SECRET);


        res.status(200).json({
            user: {
                email,
                isAdmin,
                pictureUrl
            },
            token: jwt
        });
    } catch (err) {
        logger.error(`User login failed`);
        const httpError = { status: 500, message: "User login failed", err };
        next(httpError);
    }
}