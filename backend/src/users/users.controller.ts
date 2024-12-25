import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/findAllUsers")
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/findById/:id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  @Get('/findByEmail/:email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Patch('/updateById/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Post('/follow/:followerId/:followeeId')
  follow(@Param('followerId') followerId: number, @Param('followeeId') followeeId: number) {
    return this.usersService.followUser(followerId, followeeId);
  }

  @Post('/unfollow/:followerId/:followeeId')
  unfollow(@Param('followerId') followerId: number, @Param('followeeId') followeeId: number) {
    return this.usersService.unfollowUser(followerId, followeeId);
  }

    //Fetch Followed Users by user id

  @Get('/followedUsers/:id')
  followedUsers(@Param('id') id: string) {
    return this.usersService.getFollowedUsers(+id);
  }
}
