import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Post } from "src/posts/entities/post.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    content: string;

    @Column()
    date: Date;

    @Column({ type: "time" })
    time: string;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;
}
