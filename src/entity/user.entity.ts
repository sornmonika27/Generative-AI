import "reflect-metadata"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
  import { RoleEnum } from "../common/types/enum";
@Entity({ name: "user_info" })
  export class UserInfo {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ nullable: false })
    name: string;
  
    @Column({ nullable: false })
    userEmail: string;
  
    @Column({ nullable: true })
    userContact: string;

    @Column({ nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: RoleEnum[2] }) // Fix here
    role: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    modifiedAt: Date;
  }
  