import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';

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

  @Column()
  phone: number;

  @Column()
  role: string;

  @Column()
  created_at: Date;

  @Column()
  rate?: number;

  @Column()
  experience?: number;

  @Column()
  description?: string;

  @Column()
  availability?: boolean;

  @Column()
  user_pic?: string;

  @Column()
  premium: boolean;

  @OneToMany(() => Address, (address) => address.user_id)
  address_id: Address[];

  @OneToMany(() => Service, (service) => service.worker)
  services: Service[];
}
