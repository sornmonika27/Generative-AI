import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Roadmap } from "./roadmap.entity";
  
  @Entity({ name: "milestones" })
  export class Milestone {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false })
    title: string;
  
    @Column({ nullable: false, type: "text" })
    description: string;
  
    @ManyToOne(() => Roadmap, (roadmap) => roadmap.milestones, {
      onDelete: "CASCADE", // Delete milestones if the roadmap is deleted
    })
    roadmap: Roadmap;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  