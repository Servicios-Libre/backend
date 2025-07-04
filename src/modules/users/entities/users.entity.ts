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
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Chat } from 'src/modules/chat/entities/chat.entity';
import { Social } from './social.entity';
import { Invoice } from 'src/modules/mercadopago/entities/factura.entity';

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

  @Column({ nullable: true, type: 'float' })
  rate?: number;

  @Column({ nullable: true })
  experience?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  availability: boolean;

  @Column({ nullable: true })
  user_pic?: string;

  @Column({ nullable: true })
  stripeCustomerId?: string;

  @Column({ default: false })
  premium: boolean;

  @OneToOne(() => Address, (address) => address.user_id)
  @JoinColumn()
  address_id: Address;

  @OneToOne(() => Social, (social) => social.user)
  @JoinColumn()
  social: Social;

  @OneToMany(() => Service, (service) => service.worker)
  services: Service[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @OneToMany(() => Review, (review) => review.author)
  created_reviews: Review[];

  @OneToMany(() => Review, (review) => review.worker)
  received_reviews: Review[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chatUser: Chat[];

  @OneToMany(() => Chat, (chat) => chat.otherUser)
  chatOtherUser: Chat[];

  @OneToMany(() => Invoice, (Invoice) => Invoice.user)
  invoices: Invoice[];
}
