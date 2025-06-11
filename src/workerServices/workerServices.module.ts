import { Module } from "@nestjs/common";
import { WorkerServicesController } from "./workerServices.controller";
import { WorkerServicesService } from "./workerServices.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Service } from "./entities/service.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Service]), 
    ],
    controllers: [WorkerServicesController],
    providers: [WorkerServicesService]
})
export class WorkerServicesModule {};