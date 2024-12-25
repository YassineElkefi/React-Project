import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { likePostDto } from 'src/likes/dto/create-like.dto';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';


@Injectable()
export class LikesService {

    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        private readonly userService: UsersService,
        private readonly postService: PostsService,
    ) {}

    async post(likePostDto: likePostDto): Promise<Like | null> {
        const userId = likePostDto.userId;
        const postId = likePostDto.postId;
      
        // Check if user has already liked the post
        const existingLike = await this.likeRepository.findOne({ 
          where: { 
            user: { id: userId }, 
            post: { id: postId } 
          } 
        });
      
        // If like already exists, remove the like (unlike)
        if (existingLike) {
          await this.likeRepository.remove(existingLike);
          return null;
        }
      
        // If no existing like, create a new like
        if (typeof likePostDto.date === 'string') {
          likePostDto.date = new Date(likePostDto.date);
        }
      
        const newLike = this.likeRepository.create(likePostDto);
        newLike.user = await this.userService.findOneById(userId);
        newLike.post = await this.postService.findById(postId);
        return await this.likeRepository.save(newLike);
      }

    async findAllByUserId(id: number): Promise<Like[]> {
        return await this.likeRepository.find({
            where: { user: { id: id } },
        });
    }

    async findAllByPostId(id: number): Promise<Like[]> {
        return await this.likeRepository.find({
            where: { post: { id: id } },
        });
    }

    async delete(id: number): Promise<void> {
        const result = await this.likeRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Like with ID ${id} not found`);
        }
    }

}