import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    findAll(): Promise<User[]>;
    findOneByEmail(email: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
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
        followers: User[];
        following: User[];
    } & User>;
}
