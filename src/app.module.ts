import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configTypeorm from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkerServicesModule } from './modules/workerServices/workerServices.module';
import { JwtConfig } from './config/jwt.config';
import { WorkerServicesService } from './modules/workerServices/workerServices.service';
import { Service } from './modules/workerServices/entities/service.entity';
import { Category } from './modules/workerServices/entities/category.entity';
import { User } from './modules/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configTypeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeOrmConfig = configService.get('configTypeorm');
        if (!typeOrmConfig) {
          throw new Error('TypeORM configuration is not defined');
        }
        return typeOrmConfig;
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    WorkerServicesModule,
    UsersModule,
    AuthModule,
    JwtConfig,
    TypeOrmModule.forFeature([Service, Category, User]),
  ],
  controllers: [],
  providers: [WorkerServicesService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly workerServiceService: WorkerServicesService) {}

  async onApplicationBootstrap() {
    await this.workerServiceService.seedCategories();
  }
}
