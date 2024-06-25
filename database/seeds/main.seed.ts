import { DataSource } from 'typeorm';
import { Seeder, runSeeder } from 'typeorm-extension';
import AdminSeed from './admin.seed';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, AdminSeed);
  }
}
