import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[PostsModule, UsersModule,TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports:[CommentsService]
})
export class CommentsModule {}
