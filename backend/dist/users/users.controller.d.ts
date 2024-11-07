import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findOne(email: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        id: number;
        role: string;
        deletedAt: string;
        comments: import("../comments/entities/comment.entity").Comment[];
        posts: import("../posts/entities/post.entity").Post[];
        likes: import("../likes/entities/like.entity").Like[];
        followers: import("./entities/user.entity").User[];
        following: import("./entities/user.entity").User[];
    } & import("./entities/user.entity").User>;
}
