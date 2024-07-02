import { DataSource } from 'typeorm';
import { Seeder, runSeeder } from 'typeorm-extension';
import AdminSeed from './admin.seed';
import ParseCvAgent from './parse-cv.seed';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await runSeeder(dataSource, AdminSeed);
    await runSeeder(dataSource, ParseCvAgent);
  }
}
