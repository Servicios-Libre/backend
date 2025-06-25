import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user1: string;

  @Column()
  user2: string;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
