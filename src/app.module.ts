import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configTypeorm from './config/config.typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkerServicesModule } from './modules/workerServices/workerServices.module';
import { JwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configTypeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const config = configService.get<TypeOrmModuleOptions>('configTypeorm');

        if (!config) {
          throw new Error('TypeORM config not found in configService');
        }

        return config;
      },
    }),
    JwtConfig,
    AuthModule,
    UsersModule,
    WorkerServicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
