import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/modules/users/entities/users.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.chatOtherUser)
  @JoinColumn()
  otherUser: string;

  @ManyToOne(() => User, (user) => user.chatUser)
  @JoinColumn()
  user: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
