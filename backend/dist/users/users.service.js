"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcryptjs = require("bcryptjs");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        return await this.usersRepository.save(createUserDto);
    }
    async findAll() {
        return await this.usersRepository.find();
    }
    async findOneById(id) {
        return await this.usersRepository.findOne({
            where: { id },
            relations: ['followers', 'following'],
        });
    }
    async findOneByEmail(email) {
        return await this.usersRepository.findOneBy({ email });
    }
    async update(id, updateUserDto) {
        const { email, password } = updateUserDto;
        const existingUser = await this.usersRepository.findOne({ where: { id } });
        if (!existingUser) {
            throw new common_1.NotFoundException(`User #${id} not found`);
        }
        if (email && email !== existingUser.email) {
            const emailExists = await this.usersRepository.findOne({ where: { email } });
            if (emailExists) {
                throw new common_1.BadRequestException('Email already in use');
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
    async followUser(followerId, followeeId) {
        const follower = await this.usersRepository.findOne({ where: { id: followerId } });
        const followee = await this.usersRepository.findOne({ where: { id: followeeId } });
        if (!follower || !followee) {
            throw new common_1.NotFoundException('Users not found');
        }
        if (follower.id === followee.id) {
            throw new common_1.BadRequestException('You cant follow yourself');
        }
        if (!Array.isArray(follower.following)) {
            follower.following = [];
        }
        if (!Array.isArray(followee.followers)) {
            followee.followers = [];
        }
        if (follower.following.some(user => user.id === followee.id)) {
            throw new common_1.BadRequestException('You already follow this person');
        }
        follower.following.push(followee);
        followee.followers.push(follower);
        await this.usersRepository.save(follower);
        await this.usersRepository.save(followee);
        return { message: 'Followed successfully' };
    }
    async unfollowUser(followerId, followeeId) {
        const follower = await this.usersRepository.findOne({ where: { id: followerId }, relations: ['following'] });
        const followee = await this.usersRepository.findOne({ where: { id: followeeId }, relations: ['followers'] });
        if (!follower || !followee) {
            throw new common_1.NotFoundException('Users not found');
        }
        if (!Array.isArray(follower.following)) {
            follower.following = [];
        }
        if (!Array.isArray(followee.followers)) {
            followee.followers = [];
        }
        follower.following = follower.following.filter(user => user.id !== followee.id);
        followee.followers = followee.followers.filter(user => user.id !== follower.id);
        await this.usersRepository.save(follower);
        await this.usersRepository.save(followee);
        return { message: 'Unfollowed successfully' };
    }
    async getFollowedUsers(id) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: ['following'] });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.following;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map