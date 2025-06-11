import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';

config();

const dataConfig = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  // dropSchema: true,
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

export default registerAs('configTypeorm', () => dataConfig);

export const Config = new DataSource(dataConfig as DataSourceOptions);
