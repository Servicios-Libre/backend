import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusContract } from './statusContract.enum';

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
}
