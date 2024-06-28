import { User } from 'database/entities/user.entity';
import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import { hashPassword } from 'src/common/utils/hash-password.util';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

interface UserInterface {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  role: UserRole;
}

export default class AdminSeed implements Seeder {
  private async createUser(appDataSource: DataSource): Promise<any> {
    const mockAdminUser: UserInterface = {
      name: 'admin',
      email: 'admin@gmail.com',
      password: await hashPassword('12345678'),
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    };

    const mockClientUser: UserInterface = {
      name: 'client',
      email: 'client@gmail.com',
      password: await hashPassword('12345678'),
      status: UserStatus.ACTIVE,
      role: UserRole.CLIENT,
    };

    const userInput = appDataSource.manager.create(User, mockAdminUser);
    const userClientInput = appDataSource.manager.create(User, mockClientUser);
    try {
      await appDataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([userInput, userClientInput])
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
