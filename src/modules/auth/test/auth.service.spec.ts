import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from './mocks/jwt.mock';
import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/modules/admin/admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@entities';

describe('AuthService', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let userRepositoryMock: {
    createQueryBuilder: jest.Mock;
  };

  const moduleMetadata: ModuleMetadata = {
    providers: [
      {
        provide: JwtService,
        useValue: mockJwtService,
      },
      {
        provide: getRepositoryToken(User),
        useValue: userRepositoryMock,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule(moduleMetadata).compile();

    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });
});
