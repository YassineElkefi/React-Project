import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { PostCommentDto } from './dto/post-comment.dto';
import { PostsService } from 'src/posts/posts.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly userService: UsersService,
        private readonly postService: PostsService,
    ) {}

    async post(postCommentDto: PostCommentDto): Promise<Comment> {
        const userId = postCommentDto.userId;
        const postId = postCommentDto.postId;
        if (typeof postCommentDto.date === 'string') {
            postCommentDto.date = new Date(postCommentDto.date);
        }
        const newComment = this.commentRepository.create(postCommentDto);
        newComment.user =await  this.userService.findOneById(userId);
        newComment.post =await  this.postService.findById(postId);
        return await this.commentRepository.save(newComment);
    }

    async findAllByUserId(id: number): Promise<Comment[]> {
        return await this.commentRepository.find({
            where: { user: { id: id } },
        });
    }

    async findAllByPostId(id: number): Promise<Comment[]> {
        return await this.commentRepository.find({
            where: { post: { id: id } },
            relations: ['user', 'post'],
        });
    }

    async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
        const comment = await this.findById(id);
        const updatedComment = Object.assign(comment, updateCommentDto);
        return await this.commentRepository.save(updatedComment);
    }

    async delete(id: number): Promise<void> {
        const result = await this.commentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }
    }

    async findById(id: number): Promise<Comment> {
        const post = await this.commentRepository.findOne({
            where: { id },
        });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }
}