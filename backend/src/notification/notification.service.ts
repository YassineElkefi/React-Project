import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const { recipientId, senderId, type, content, postId } = createNotificationDto;
    const recipient = await this.userRepository.findOne({ where: { id: recipientId } });
    const sender = await this.userRepository.findOne({ where: { id: senderId } });

    const notification = this.notificationRepository.create({
      recipient,
      sender,
      type,
      content,
      postId,
      read: false,
    });

    return this.notificationRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({ relations: ['recipient', 'sender'] });
  }

  async findOne(id: number): Promise<Notification> {
    return this.notificationRepository.findOne({ where: { id }, relations: ['recipient', 'sender'] });
  }
  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    notification.read = true;
    return this.notificationRepository.save(notification);
  }
}
