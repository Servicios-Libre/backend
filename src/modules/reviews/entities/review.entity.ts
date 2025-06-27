import { User } from 'src/modules/users/entities/users.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'REVIEWS',
})
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (user) => user.createdReviews)
  @JoinColumn()
  author: User;

  @OneToMany(() => User, (user) => user.workerReviews)
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
}
