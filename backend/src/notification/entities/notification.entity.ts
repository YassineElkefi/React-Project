import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  recipient: User;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column({ default: false })
  read: boolean;

  @Column()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;
}
