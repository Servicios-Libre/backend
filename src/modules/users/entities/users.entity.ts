import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Service } from 'src/modules/workerServices/entities/service.entity';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column()
  role: string;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  rate?: number;

  @Column({ nullable: true })
  experience?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  availability: boolean;

  @Column({ nullable: true })
  user_pic?: string;

  @Column({ default: false })
  premium: boolean;

  @OneToOne(() => Address, (address) => address.user_id)
  @JoinColumn()
  address_id: Address;

  @OneToMany(() => Service, (service) => service.worker)
  services: Service[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
