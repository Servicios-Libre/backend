import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/users.entity'; // suponiendo que tenés una entidad de usuario
import { PaymentProvider } from './PaymentProvider';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  externalReference: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  paymentType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  expiredAt: Date;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider: PaymentProvider;

  @ManyToOne(() => User, (user) => user.invoices)
  user: User;
}
