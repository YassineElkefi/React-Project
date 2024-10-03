import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<CreateUserDto & User>;
    findAll(): string;
    findOneByEmail(email: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
