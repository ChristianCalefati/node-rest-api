import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Course } from "./course";

@Entity({
  name: "lessons",
})
export class Lesson {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  duration: string;

  @Column()
  seqNo: number;

  @ManyToOne(() => Course, course => course.lessons)
  @JoinColumn({ name: "courseId" })
  course: Course

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
