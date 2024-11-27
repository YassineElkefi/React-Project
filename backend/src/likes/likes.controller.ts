import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';
import { likePostDto } from './dto/create-like.dto';

@Controller('likes')
export class LikesController {
    constructor(
        private readonly likesService: LikesService
    ) {}

    @Post('/like-post')
    async likePost(@Body() likePostDto: likePostDto) {
        return this.likesService.post(likePostDto);
    }

    @Get('/get-likes-user-id/:id')
    async findAllByUserId(@Param('id') id: number) {
        return this.likesService.findAllByUserId(id);
    }

    @Get('/get-likes-post-id/:id')
    async findAllByPostId(@Param('id') id: number) {
        return this.likesService.findAllByPostId(id);
    }

    @Delete('/delete-like/:id')
    async delete(@Param('id') id: number) {
        return this.likesService.delete(id);
    }
}
