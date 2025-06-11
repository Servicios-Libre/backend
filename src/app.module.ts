import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { WorkerServicesModule } from './workerServices/workerServices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeOrmConfig = configService.get('typeorm');
        if (!typeOrmConfig) {
          throw new Error('TypeORM configuration is not defined');
        }
        return typeOrmConfig;
      },
    }),
    WorkerServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
