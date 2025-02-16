import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {

    @PrimaryColumn()
    id: number;

    @Column()
    passwordHash: string;

    @Column()
    email: string;

    @Column()
    pictureUrl: string;

    @Column()
    isAdmin: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}