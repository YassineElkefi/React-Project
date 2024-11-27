import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ){}
  
  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.save(createUserDto);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id })
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, password } = updateUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (email && email !== existingUser.email) {
      const emailExists = await this.usersRepository.findOne({ where: { email } });
      if (emailExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (password) {
      const salt = await bcryptjs.genSalt();
      updateUserDto.password = await bcryptjs.hash(password, salt);
    }

    const updatedUser = await this.usersRepository.save({
      ...existingUser,
      ...updateUserDto,
    });

    return updatedUser;
  }

  async followUser(followerId: number, followeeId: number) {
    const follower = await this.usersRepository.findOne({where: { id: followerId }});

    const followee = await this.usersRepository.findOne({where: { id: followeeId }});

    if (!follower || !followee) {
      throw new NotFoundException('Users not found');
    }

    if (follower.id === followee.id) {
      throw new BadRequestException('You cant follow yourself');
    }

    if (follower.following.some(user => user.id === followee.id)) {
      throw new BadRequestException('You already follow this person');
    }

    follower.following.push(followee);
    followee.followers.push(follower);

    await this.usersRepository.save(follower);
    await this.usersRepository.save(followee);

    return { message: 'Followed successfully' };
  }

  async unfollowUser(followerId: number, followeeId: number) {
    
    const follower = await this.usersRepository.findOne({where: { id: followerId }});

    const followee = await this.usersRepository.findOne({where: { id: followeeId }});

    if (!follower || !followee) {
      throw new NotFoundException('Users not found');
    }

    follower.following = follower.following.filter(user => user.id !== followee.id);
    followee.followers = followee.followers.filter(user => user.id !== follower.id);

    await this.usersRepository.save(follower);
    await this.usersRepository.save(followee);

    return { message: 'Unfollowed successfully' };
  }

}
