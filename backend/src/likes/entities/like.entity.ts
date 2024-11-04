import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "src/posts/entities/post.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Like {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column({ type: "time" })
    time: string;

    @ManyToOne(() => Post, (post) => post.likes)
    post: Post;

    @ManyToOne(() => User, (user) => user.likes)
    user: User;
}
