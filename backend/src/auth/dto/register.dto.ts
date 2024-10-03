import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto{
    @IsString()
    @MinLength(1)
    firstName: string;

    @IsString()
    @MinLength(1)
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    password: string;
}