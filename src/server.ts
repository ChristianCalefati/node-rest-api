import * as dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.log("Error loading environment variables, aborting....");
  process.exit(1);
}

console.log(process.env.PORT);

import * as express from "express";
import { root } from "./routes/root";
import { isNumber } from "./utils";
import { logger } from "./logger";
import { AppDataSource } from "./data-source";

const app = express();

function setupExpress() {
  app.route("/").get(root);
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
