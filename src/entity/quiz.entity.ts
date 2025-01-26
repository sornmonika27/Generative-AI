import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
import { UserInfo } from "./user.entity";
  
  @Entity({ name: "quizzes" })
  export class Quiz {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false })
    question: string;
  
    @Column("simple-array", { nullable: false })
    options: string[]; // Array of options for the quiz
  
    @Column({ nullable: false })
    correctAnswer: string;

    @ManyToOne(() => UserInfo, (user) => user.quizzes, {
        onDelete: "CASCADE", // Delete quizzes if the user is deleted
      })
      user: UserInfo;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  