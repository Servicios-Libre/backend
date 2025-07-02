import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusContract } from './statusContract.enum';
import { Chat } from './chat.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workerId: string;

  @Column()
  clientId: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ default: StatusContract.pending })
  status: string;

  @Column()
  payment: number;

  @Column({ default: false })
  clientConfirmed: boolean;

  @Column({ default: false })
  workerConfirmed: boolean;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Chat, (chat) => chat.contracts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column()
  chatId: string;
}
