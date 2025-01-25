import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Milestone } from "./milestone.entity";
  
  @Entity({ name: "roadmaps" })
  export class Roadmap {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false })
    title: string;
  
    @OneToMany(() => Milestone, (milestone) => milestone.roadmap, {
      cascade: true, // Automatically save related milestones
    })
    milestones: Milestone[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  