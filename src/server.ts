import * as dotenv from "dotenv";

//Configuration of the environment variables
const result = dotenv.config();

if (result.error) {
  console.log("Error loading environment variables, aborting....");
  process.exit(1);
}

console.log(`Port seleted in Env Variables:${process.env.PORT}`);

import "reflect-metadata";
import * as express from "express";
import { root } from "./routes/root";
import { isNumber } from "./utils";
import { logger } from "./logger";
import { AppDataSource } from "./data-source";
import { getAllCourses } from "./routes/get-all-courses";
import { defaultErrorHandler } from "./middlewares/default-error-handler";
import { getCourseByUrl } from "./routes/get-course-by-url";
import { findLessonsForCourse } from "./routes/find-lessons-for-course";
import { updateCourse } from "./routes/update-course";
import bodyParser = require("body-parser");
import { createCourse } from "./routes/create-course";
import { deleteCourseAndLessons } from "./routes/delete-course";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { checkIfAuthenticated } from "./middlewares/authentication-middleware";

// Create an express application
//1 - setupExpress function
//2 - startServer function
const cors = require("cors");
const app = express();

function setupExpress() {
  app.use(cors({ origin: true }));
  app.use(bodyParser.json());
  app.route("/").get(root);
  app.route("/api/courses").get(checkIfAuthenticated, getAllCourses);
  app.route("/api/courses/:courseUrl").get(checkIfAuthenticated, getCourseByUrl);
  app.route("/api/courses/:courseId/lessons").get(checkIfAuthenticated, findLessonsForCourse);
  app.route("/api/courses/:courseId").patch(checkIfAuthenticated, updateCourse);
  app.route("/api/couses").post(checkIfAuthenticated, createCourse);
  app.route("/api/courses/:courseId").delete(checkIfAuthenticated, deleteCourseAndLessons);
  app.route("/api/users").post(checkIfAuthenticated, createUser);
  app.route("/api/login").post(login);
  app.use(defaultErrorHandler);
}

function startServer() {
  const portEnv = process.env.PORT;
  const portArg = process.argv[2];

  let port: number;

  if (isNumber(portEnv)) {
    port = parseInt(portEnv);
  }

  if (!port && isNumber(portArg)) {
    port = parseInt(portArg);
  }

  if (!port) {
    port = 9000;
  }

  app.listen(port, () => {
    logger.info(`Express is running on port localhost:${port}`);
  });
}
//

// Initialize the data source and stop Nodejs process if it fails
AppDataSource.initialize()
  .then(() => {
    logger.info("The datasource has been initialized successfully");
    setupExpress();
    startServer();
  })
  .catch((err) => {
    logger.error("Error during DataSource initialization.", err);
    process.exit(1);
  });
