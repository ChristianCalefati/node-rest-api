import * as dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.log("Error loading environment variables, aborting....");
  process.exit(1);
}

import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { COURSES } from "./data-db";

async function populateDb() {
  await AppDataSource.initialize();
  console.log("Database connection ready");
}

populateDb()
  .then(() => {
    console.log("Finished populating Database. exiting...");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error populating Database", err);
    process.exit(1);
  });
