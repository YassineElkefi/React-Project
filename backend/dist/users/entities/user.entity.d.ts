import { Post } from "src/posts/entities/post.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    deletedAt: string;
    comments: Comment[];
    posts: Post[];
    likes: Like[];
    followers: User[];
    following: User[];
}
