import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity({
  name: 'WORK_PHOTOS',
})
export class WorkPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, (service: Service) => service.work_photos, {
    onDelete: 'CASCADE',
  })
  service: Service;

  @Column({
    type: 'text',
  })
  photo_url: string;
}
