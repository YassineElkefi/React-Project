import { Controller, Body, HttpCode, HttpStatus, Post, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("register")
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }

    @Get("profile")
    @UseGuards(AuthGuard)
    profile(@Request() req){
        return req.user;
    }
}
