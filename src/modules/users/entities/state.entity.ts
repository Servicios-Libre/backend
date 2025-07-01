import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './cities.entity';

@Entity({ name: 'state' })
export class State {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  state: string;

  @OneToMany(() => City, (city) => city.state)
  @JoinColumn()
  cities: City[];
}
