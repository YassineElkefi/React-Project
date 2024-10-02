import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async register({firstName, lastName, email, password}: RegisterDto){
        const user = await this.usersService.findOneByEmail(email);

        if (user){
            throw new BadRequestException("Email already in use");
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        await this.usersService.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        });
        return {
            message: "User created successfully."
        };
    }

    async login({email, password}: LoginDto){
        const user = await this.usersService.findOneByEmail(email);

        if(!user){
            throw new UnauthorizedException("Invalid credentials.")
        }

        const isPasswordValid = await bcryptjs.compare(password,user.password);

        if (!isPasswordValid){
            throw new UnauthorizedException("Invalid credentials.")
        }

        const payload = {email: user.email}
        const token = await this.jwtService.signAsync(payload)

        return {
            token: token,
            email: user.email
        };
    }
}
