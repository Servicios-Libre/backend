import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';
import { Service } from 'src/modules/workerServices/entities/service.entity';

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

  @Column({
    nullable: true,
  })
  availability?: boolean;

  @Column()
  user_pic?: string;

  @Column({
    default: false,
  })
  premium: boolean;

  @OneToMany(() => Address, (address) => address.user_id)
  address_id: Address[];

  @OneToMany(() => Service, (service) => service.worker)
  services: Service[];
}
