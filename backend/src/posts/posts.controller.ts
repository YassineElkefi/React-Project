import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Post("create-post")
    async create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Get("/get-all-posts")
    async findAll() {
        return this.postsService.findAll();
    }

    @Get('/get-posts-user-id/:id')
    async findAllByUserId(@Param('id') id: number) {
        return this.postsService.findAllByUserId(id);
    }

    @Put('/update-post/:id')
    async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, updatePostDto);
    }

    @Delete('/delete-post/:id')
    async delete(@Param('id') id: number) {
        return this.postsService.delete(id);
    }
}