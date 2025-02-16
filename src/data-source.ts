import { DataSource } from "typeorm";
import { Lesson } from "./model/lesson";
import { Course } from "./model/course";
import { User } from "./model/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [
    Course, 
    Lesson,
    User
  ],
  synchronize: true,
  logging: true,
});
