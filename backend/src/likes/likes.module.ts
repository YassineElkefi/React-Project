import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[UsersModule, PostsModule, TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [LikesService],
  exports:[LikesService]
})
export class LikesModule {}
