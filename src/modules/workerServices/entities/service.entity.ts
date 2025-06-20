import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { WorkPhoto } from './workPhoto.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { Ticket } from 'src/modules/tickets/entities/ticket.entity';

@Entity({
  name: 'SERVICES',
})
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user: User) => user.services)
  @JoinColumn()
  worker: User;

  @ManyToOne(() => Category, (category: Category) => category.services)
  @JoinColumn()
  category: Category;

  @Column({
    type: 'varchar',
    length: 50,
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @OneToMany(() => WorkPhoto, (work_photo: WorkPhoto) => work_photo.service)
  @JoinColumn()
  work_photos: WorkPhoto[];

  @OneToOne(() => Ticket, (ticket: Ticket) => ticket.service)
  @JoinColumn()
  ticket: Ticket;
}
