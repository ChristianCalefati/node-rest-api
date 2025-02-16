import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    passwordHash: string;

    @Column()  
    passwordSalt: string;

    @Column()
    email: string;

    @Column({nullable: true})
    pictureUrl: string;

    @Column({default: false})
    isAdmin: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}