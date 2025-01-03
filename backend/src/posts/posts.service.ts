import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly userService: UsersService
    ) {}

    async create(createPostDto: CreatePostDto): Promise<Post> {
        const userId = createPostDto.userId;
        if (typeof createPostDto.date === 'string') {
            createPostDto.date = new Date(createPostDto.date);
        }
        const newPost = this.postRepository.create(createPostDto);
        newPost.user =await  this.userService.findOneById(userId);
        return await this.postRepository.save(newPost);
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepository.find({
            relations: ['user', 'comments'],
        });
    }

    async findById(id: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user', 'comments'],
        });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    async findAllByUserId(id: number): Promise<Post[]> {
        return await this.postRepository.find({
            where: { user: { id: id } },
            relations: ['user', 'comments'],
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
        const post = await this.findById(id);
        const updatedPost = Object.assign(post, updatePostDto);
        return await this.postRepository.save(updatedPost);
    }

    async delete(id: number): Promise<void> {
        // First check if post exists
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['comments', 'likes']
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        // Delete related comments and likes using querybuilder
        await this.postRepository.manager.transaction(async transactionalEntityManager => {
            // Delete comments
            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from('comment')
                .where('postId = :postId', { postId: id })
                .execute();

            // Delete likes
            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from('like')
                .where('postId = :postId', { postId: id })
                .execute();

            // Finally delete the post
            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from('post')
                .where('id = :id', { id })
                .execute();
        });
    }
}
