import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Roles } from '../user/enums/roles.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword123',
    role: Roles.PARTICIPANT,
    isApproved: false,
    comparePassword: jest.fn(),
    toObject: jest.fn(),
  };

  const mockUserDto = {
    _id: '507f1f77bcf86cd799439011',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: Roles.PARTICIPANT,
    isApproved: false,
  };

  beforeEach(async () => {
    const mockUserService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue(mockUser as any);

      const result = await authService.register(registerDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(authService.register(registerDto)).rejects.toThrow(
        'This email is already exist',
      );
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should successfully login and return access token with user data', async () => {
      const mockUserWithMethods = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: jest
          .fn()
          .mockReturnValue({ ...mockUserDto, password: 'hashedPassword123' }),
      };
      userService.findByEmail.mockResolvedValue(mockUserWithMethods as any);
      jwtService.signAsync.mockResolvedValue('mock-jwt-token');

      const result = await authService.login(loginDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockUserWithMethods.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        full_name: `${mockUser.first_name} ${mockUser.last_name}`,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: expect.objectContaining({
          _id: mockUser._id,
          email: mockUser.email,
        }),
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.login(loginDto)).rejects.toThrow(
        'Email or password is incorrect',
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUserWithMethods = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      userService.findByEmail.mockResolvedValue(mockUserWithMethods as any);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserWithMethods.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
      );
    });
  });

  describe('getMe', () => {
    it('should return user data without password', async () => {
      const mockUserWithMethods = {
        ...mockUser,
        toObject: jest
          .fn()
          .mockReturnValue({ ...mockUserDto, password: 'hashedPassword123' }),
      };
      userService.findOne.mockResolvedValue(mockUserWithMethods as any);

      const result = await authService.getMe(mockUser._id);

      expect(userService.findOne).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(
        expect.objectContaining({
          _id: mockUser._id,
          email: mockUser.email,
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
        }),
      );
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(authService.getMe('nonexistent-id')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.getMe('nonexistent-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('becomeOrganizer', () => {
    it('should update user role to ORGANIZER', async () => {
      const updatedUser = {
        ...mockUser,
        role: Roles.ORGANIZER,
        isApproved: false,
      };
      userService.findOne.mockResolvedValue(mockUser as any);
      userService.update.mockResolvedValue(updatedUser as any);

      const result = await authService.becomeOrganizer(mockUser._id);

      expect(userService.findOne).toHaveBeenCalledWith(mockUser._id);
      expect(userService.update).toHaveBeenCalledWith(mockUser._id, {
        role: Roles.ORGANIZER,
        isApproved: false,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userService.findOne.mockResolvedValue(null);

      await expect(
        authService.becomeOrganizer('nonexistent-id'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        authService.becomeOrganizer('nonexistent-id'),
      ).rejects.toThrow('User not found');
    });
  });
});
