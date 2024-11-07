import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber } from 'class-validator';

export class PostCommentDto {

    @IsString()
    content: string;

    @IsDate()
    @Type(() => Date) 
    date: Date;

    @IsString()
    time: string;

    @IsNumber()
    postId: number;

    @IsNumber()
    userId: number;

}