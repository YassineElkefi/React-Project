import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreatePostDto {

    @IsString()
    @IsOptional()
    description: string;

    @IsDate()
    @Type(() => Date) 
    date: Date;

    @IsString()
    time: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsNumber()
    userId: number;

}
