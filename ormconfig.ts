import * as dotenv from 'dotenv';
import { NamingStrategy } from 'database/typeorm/naming.strategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from 'database/seeds/main.seed';

dotenv.config({
  path: '.env',
});

const options: DataSourceOptions & SeederOptions = {
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
  seeds: [MainSeeder],
};

export const connectionSource = new DataSource(options);
