import { PartialType } from '@nestjs/mapped-types';
import { PostCommentDto } from './post-comment.dto';

export class UpdateCommentDto extends PartialType(PostCommentDto) {}
