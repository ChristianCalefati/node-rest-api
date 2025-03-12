import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

export function checkIfAdmin(req: Request, res: Response, next: NextFunction) {
    const userProfile = req["userProfile"];

    if (!userProfile?.isAdmin) {
        logger.info(`User is not an admin. Access denied`);
        res.sendStatus(403);
        return;
    }
    
    next();
}