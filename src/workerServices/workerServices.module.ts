import { Module } from "@nestjs/common";
import { WorkerServicesController } from "./workerServices.controller";
import { WorkerServicesService } from "./workerServices.service";

@Module({
    controllers: [WorkerServicesController],
    providers: [WorkerServicesService]
})
export class WorkerServicesModule {};