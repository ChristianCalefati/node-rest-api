import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

const JWT_SECRET = process.env.JWT_SECRET;
const jsonwebtoken = require("jsonwebtoken");
const util = require("util");
const verifyJwt = util.promisify(jsonwebtoken.verify);

export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    const jwt = req.headers.authorization;

    if (!jwt) {
        logger.info(`No JWT token provided. Request denied`);
        res.sendStatus(403);
        return;
    }

    verifyJwt(jwt, JWT_SECRET)
        .then((decodedPayload) => {
            logger.info(`Authentication JWT successfully decoded: `,  decodedPayload);
            req["userProfile"] = decodedPayload;
            next();
        })
        .catch(err => {
            logger.info(`Could not authernticate JWT token`, err);
            res.sendStatus(403);
        })
}