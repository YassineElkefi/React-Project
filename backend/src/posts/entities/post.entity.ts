import { User } from "src/users/entities/user.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: true})
    description: string;

    @Column()
    date: Date;

    @Column({ type: "time" })
    time: string;

    @Column({ type: "text", nullable: true })
    image: string;

    @OneToMany(() => Comment, (comment) => comment.post, {
        cascade: true,
        onDelete: 'CASCADE' 
    })
    comments: Comment[];

    @OneToMany(() => Like, (like) => like.post, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    likes: Like[];

    @ManyToOne(() => User, (user) => user.posts)
    user: User;
}