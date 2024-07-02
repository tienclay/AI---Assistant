import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NamingStrategy } from 'database/typeorm/naming.strategy';
import { join } from 'path';

export default registerAs<TypeOrmModuleOptions>('ai-database', () => ({
  name: 'cv-parser',
  type: 'postgres',
  host: process.env.AI_POSTGRES_HOST,
  port: parseInt(process.env.AI_POSTGRES_PORT!, 10),
  username: process.env.AI_POSTGRES_USER,
  password: process.env.AI_POSTGRES_PASSWORD,
  database: process.env.AI_POSTGRES_DB,
  logging: process.env.DB_LOGGING === 'true',
  autoLoadEntities: true,
  keepConnectionAlive: true,
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
  namingStrategy: new NamingStrategy(),
}));
