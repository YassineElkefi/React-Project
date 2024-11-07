import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PostCommentDto } from './dto/post-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';


@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ) {}

    @Post("/post-comment")
    async post(@Body() postCommentDto: PostCommentDto) {
        return this.commentsService.post(postCommentDto);
    }

    @Get('/get-comments-user-id/:id')
    async findAllByUserId(@Param('id') id: number) {
        return this.commentsService.findAllByUserId(id);
    }

    @Get('/get-comments-post-id/:id')
    async findAllByPostId(@Param('id') id: number) {
        return this.commentsService.findAllByPostId(id);
    }

    @Patch('/update-comment/:id')
    async update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentsService.update(id, updateCommentDto);
    }

    @Delete('/delete-comment/:id')
    async delete(@Param('id') id: number) {
        return this.commentsService.delete(id);
    }
}