import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class User {

    @Column({primary: true, generated: true})
    id: number;

    @Column({length: 20})
    firstName: string;

    @Column({length: 20})
    lastName: string;
    
    @Column({unique:true, nullable: false})
    email: string;

    @Column({nullable:false})
    password: string;

    @Column({default: "ROLE_USER"})
    role: string;

    @DeleteDateColumn()
    deletedAt: string;
}
