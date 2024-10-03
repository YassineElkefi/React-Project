import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register({ firstName, lastName, email, password }: RegisterDto): Promise<{
        message: string;
    }>;
    login({ email, password }: LoginDto): Promise<{
        token: string;
        email: string;
    }>;
}
