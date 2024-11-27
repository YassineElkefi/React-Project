import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';

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
