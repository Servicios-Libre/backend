import { User } from 'src/modules/users/entities/users.entity';
import { Contract } from 'src/modules/chat/entities/contract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'REVIEWS',
})
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.created_reviews)
  @JoinColumn()
  author: User;

  @ManyToOne(() => User, (user) => user.received_reviews)
  @JoinColumn()
  worker: User;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'int',
  })
  rate: number;

  @Column({
    type: 'timestamp',
    default: new Date(),
  })
  created_at: Date;

  @ManyToOne(() => Contract, { nullable: false })
  @JoinColumn()
  contract: Contract;

  @Column()
  contractId: string;
}
