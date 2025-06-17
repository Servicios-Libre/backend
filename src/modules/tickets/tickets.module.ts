import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/tickets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [],
  providers: [TicketsService],
})
export class TicketsModule {}
