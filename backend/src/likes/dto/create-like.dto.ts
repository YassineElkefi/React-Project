import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class likePostDto{

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