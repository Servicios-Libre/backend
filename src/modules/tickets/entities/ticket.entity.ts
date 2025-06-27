import { User } from 'src/modules/users/entities/users.entity';
import { Service } from 'src/modules/workerServices/entities/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TicketType {
  SERVICE = 'service',
  TO_WORKER = 'to-worker',
}

export enum TicketStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity({
  name: 'TICKETS',
})
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TicketType,
  })
  type: TicketType;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @Column({
    type: 'varchar',
    length: '15',
  })
  created_at: string;

  @ManyToOne(() => User, (user: User) => user.tickets)
  @JoinColumn()
  user: User;

  @OneToOne(() => Service, (service: Service) => service.ticket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  service: Service;
}
