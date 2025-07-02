import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configTypeorm from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkerServicesModule } from './modules/workerServices/workerServices.module';
import { JwtConfig } from './config/jwt.config';
import { WorkerServicesService } from './modules/workerServices/workerServices.service';
import { Service } from './modules/workerServices/entities/service.entity';
import { Category } from './modules/workerServices/entities/category.entity';
import { User } from './modules/users/entities/users.entity';
import { FilesModule } from './modules/files/files.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { TicketsService } from './modules/tickets/tickets.service';
import { Ticket } from './modules/tickets/entities/ticket.entity';
import { EmailModule } from './modules/email/email.module';
import { EmailService } from './modules/email/email.service';
import { ChatModule } from './modules/chat/chat.module';
import { StripeModule } from './modules/stripe/stripe.module';
import stripeConfig from './config/stripe.config';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MercadoPagoModule } from './modules/mercadopago/mp.module';
import { UsersService } from './modules/users/users.service';
import { Address } from './modules/users/entities/address.entity';
import { Social } from './modules/users/entities/social.entity';
import { State } from './modules/users/entities/state.entity';
import { City } from './modules/users/entities/cities.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configTypeorm, stripeConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const config = configService.get('configTypeorm');
        if (!config) {
          throw new Error('TypeORM configuration is not defined');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return config;
      },
    }),
    WorkerServicesModule,
    FilesModule,
    UsersModule,
    AuthModule,
    JwtConfig,
    TypeOrmModule.forFeature([
      Service,
      Category,
      User,
      Ticket,
      Address,
      Social,
      State,
      City,
    ]),
    StripeModule,
    CategoriesModule,
    TicketsModule,
    EmailModule,
    ChatModule,
    ReviewsModule,
    MercadoPagoModule,
  ],
  controllers: [],
  providers: [
    WorkerServicesService,
    TicketsService,
    EmailService,
    UsersService,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly workerServiceService: WorkerServicesService,
    private readonly userService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    await this.workerServiceService.seedCategories();
    await this.userService.seederStatesCities();
  }
}
