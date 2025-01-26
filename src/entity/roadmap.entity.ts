import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from "typeorm";
  import { Milestone } from "./milestone.entity";
import { UserInfo } from "./user.entity";
  
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

    @ManyToOne(() => UserInfo, (user) => user.roadmaps, {
        onDelete: "CASCADE", // Delete roadmaps if the user is deleted
      })
      user: UserInfo;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  