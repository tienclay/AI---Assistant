import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from './mocks/jwt.mock';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@entities';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { mockAccessToken } from './mocks/token.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepositoryMock: {
    createQueryBuilder: jest.Mock;
  };

  beforeEach(async () => {
    userRepositoryMock = {
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    userRepositoryMock.createQueryBuilder().getRawOne.mockResolvedValue(null);
    await expect(
      authService.login({ email: 'test@example.com', password: 'password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    userRepositoryMock.createQueryBuilder().getRawOne.mockResolvedValue({
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'wrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
