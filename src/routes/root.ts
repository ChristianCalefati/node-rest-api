import { Request, Response } from "express";

export function root(request: Request, response: Response) {

    response.status(200).send("<h1>node-rest-api is listening to port 9000...</h1>");


}