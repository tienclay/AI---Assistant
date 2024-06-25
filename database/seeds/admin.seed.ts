import { User } from 'database/entities/user.entity';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import { hashPassword } from 'src/common/utils/hash-password.util';
import { UserInputDto } from 'src/modules/user/dto';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class AdminSeed implements Seeder {
  private async createUser(appDataSource: DataSource): Promise<any> {
    const mockAdminUser: UserInputDto = {
      name: 'admin',
      email: 'admin@gmail.com',
      password: await hashPassword('12345678'),
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    };

    const userInput = appDataSource.manager.create(User, mockAdminUser);

    try {
      await appDataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(userInput)
        .execute();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async run(appDataSource: DataSource): Promise<any> {
    try {
      await this.createUser(appDataSource);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
