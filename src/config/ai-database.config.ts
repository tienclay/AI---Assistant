import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs<TypeOrmModuleOptions>('ai-database', () => ({
  name: 'cv-parser',
  type: 'postgres',
  host: process.env.AI_POSTGRES_HOST,
  port: parseInt(process.env.AI_POSTGRES_PORT!, 10),
  username: process.env.AI_POSTGRES_USER,
  password: process.env.AI_POSTGRES_PASSWORD,
  database: process.env.AI_POSTGRES_DB,
}));
