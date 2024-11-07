import { Post } from "src/posts/entities/post.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
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

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    @ManyToMany(() => User, (user) => user.following)
    @JoinTable({
        name: "user_followers",
        joinColumn: { name: "userId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "followerId", referencedColumnName: "id" },
    })
    followers: User[];

    @ManyToMany(() => User, (user) => user.followers)
    following: User[];
}
