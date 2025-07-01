import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'social' })
export class Social {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'facebook', type: 'varchar', nullable: true })
  facebook: string;

  @Column({ name: 'instagram', type: 'varchar', nullable: true })
  instagram: string;

  @Column({ name: 'x', type: 'varchar', nullable: true })
  x: string;

  @Column({ name: 'linkedin', type: 'varchar', nullable: true })
  linkedin: string;

  @OneToOne(() => User, (user) => user.social)
  user: User;
}
