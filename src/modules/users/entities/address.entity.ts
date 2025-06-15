import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column({ nullable: true })
  house_number: number;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  zip_code: string;

  @OneToOne(() => User, (user) => user.address_id)
  user_id: User;
}
