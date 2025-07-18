import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { Contract } from './contract.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.chatOtherUser)
  @JoinColumn()
  otherUser: User;

  @ManyToOne(() => User, (user) => user.chatUser)
  @JoinColumn()
  user: User;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToMany(() => Contract, (contract) => contract.chat)
  contracts: Contract[];
}
