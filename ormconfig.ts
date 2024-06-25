import * as dotenv from 'dotenv';
import { NamingStrategy } from 'database/typeorm/naming.strategy';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({
  path: '.env',
});

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT!, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/database/entities/*.entity{.ts,.js}`],
  namingStrategy: new NamingStrategy(),
  migrationsTableName: '__migrations',
  migrations: ['./database/migrations/**/*.ts'],
  synchronize: false,
  migrationsRun: true,
};

export const connectionSource = new DataSource(options);
