import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
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
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  