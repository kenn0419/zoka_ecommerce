import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import { UserRepository } from './repositories/user.repository';
import { AddressRepository } from '../address/address.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserGender, UserStatus } from '@prisma/client';

jest.mock('bcrypt', () => ({
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
}));

const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    if (key === 'BCRYPT_SALT_ROUNDS') return 10;
    if (key === 'SUPABASE_BUCKET_FOLDER_USER') return 'users';
    if (key === 'SUPABASE_BUCKET') return 'bucket_url';
    return null;
  }),
};

const mockUploadService = {
  uploadFile: jest.fn(),
  removeFile: jest.fn(),
};

const mockUserRepository = {
  findUnique: jest.fn(),
  create: jest.fn(),
  listPaginatedUsers: jest.fn(),
  updateUser: jest.fn(),
  changeUserStatus: jest.fn(),
  deleteUser: jest.fn(),
};

const mockAddressRepository = {
  createAddress: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UploadService, useValue: mockUploadService },
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: AddressRepository, useValue: mockAddressRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const mockCreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      fullName: 'Test User',
      address: 'Test Address',
      birthday: new Date(),
      gender: UserGender.MALE,
    };

    it('should throw ConflictException if email exists', async () => {
      mockUserRepository.findUnique.mockResolvedValueOnce({ id: '1', email: 'test@example.com' });

      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findUnique).toHaveBeenCalledWith({ email: mockCreateUserDto.email });
    });

    it('should throw ConflictException if phone exists', async () => {
      mockUserRepository.findUnique
        .mockResolvedValueOnce(null) // First call for email returns null
        .mockResolvedValueOnce({ id: '1', phone: '1234567890' }); // Second for phone returns user
        
      await expect(service.createUser(mockCreateUserDto)).rejects.toThrow(ConflictException);
    });

    it('should successfully create a new user without a file', async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);
      const mockCreatedUser = { id: 'new-id', ...mockCreateUserDto };
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(mockCreateUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockAddressRepository.createAddress).toHaveBeenCalledWith(
        'new-id',
        mockCreateUserDto.address,
        mockCreateUserDto.fullName,
        mockCreateUserDto.phone,
      );
    });

    it('should successfully create a new user with an avatar file', async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);
      mockUploadService.uploadFile.mockResolvedValue({ url: 'http://avatar.url/image.jpg' });
      const mockCreatedUser = { id: 'new-id', ...mockCreateUserDto, avatarUrl: 'http://avatar.url/image.jpg' };
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const file = { originalname: 'test.jpg' } as Express.Multer.File;
      const result = await service.createUser(mockCreateUserDto, file);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUploadService.uploadFile).toHaveBeenCalledWith(file, 'users');
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        avatarUrl: 'http://avatar.url/image.jpg'
      }));
    });
  });

  describe('findUser', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);
      await expect(service.findUser('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should return a user if found', async () => {
      const mockUser = { id: '1', fullName: 'Test' };
      mockUserRepository.findUnique.mockResolvedValue(mockUser);
      const result = await service.findUser('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    const mockUser = { id: '1', email: 'test@example.com', phone: '123' };
    const mockUpdateDto = { email: 'new@example.com', phone: '456' };

    it('should throw ConflictException if new email is taken by another user', async () => {
      jest.spyOn(service, 'findUser').mockResolvedValue(mockUser as any);
      mockUserRepository.findUnique.mockResolvedValueOnce({ id: '2', email: 'new@example.com' });

      await expect(service.updateUser('1', mockUpdateDto as any)).rejects.toThrow(ConflictException);
    });

    it('should update user successfully', async () => {
      jest.spyOn(service, 'findUser').mockResolvedValue(mockUser as any);
      mockUserRepository.findUnique.mockResolvedValue(null); // No conflicts
      mockUserRepository.updateUser.mockResolvedValue({ ...mockUser, ...mockUpdateDto } as any);

      const result = await service.updateUser('1', mockUpdateDto as any);
      expect(result.email).toBe('new@example.com');
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith({ id: '1' }, mockUpdateDto);
    });
  });

  describe('activeUser and deactive', () => {
    it('should active user', async () => {
      mockUserRepository.changeUserStatus.mockResolvedValue({ status: UserStatus.ACTIVE } as any);
      const result = await service.activeUser('1');
      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(mockUserRepository.changeUserStatus).toHaveBeenCalledWith({ id: '1' }, UserStatus.ACTIVE);
    });

    it('should deactive user', async () => {
      mockUserRepository.changeUserStatus.mockResolvedValue({ status: UserStatus.INACTIVE } as any);
      const result = await service.deactive('1');
      expect(result.status).toBe(UserStatus.INACTIVE);
      expect(mockUserRepository.changeUserStatus).toHaveBeenCalledWith({ id: '1' }, UserStatus.INACTIVE);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and remove avatar file if exists', async () => {
      const mockUser = { id: '1', avatarUrl: 'bucket_url/users/avatar.jpg' };
      jest.spyOn(service, 'findUser').mockResolvedValue(mockUser as any);
      mockUserRepository.deleteUser.mockResolvedValue(mockUser as any);

      await service.deleteUser('1');

      expect(mockUploadService.removeFile).toHaveBeenCalledWith('users/avatar.jpg');
      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith({ id: '1' });
    });
    
    it('should delete user without avatar without calling uploadService', async () => {
      const mockUser = { id: '1', avatarUrl: null };
      jest.spyOn(service, 'findUser').mockResolvedValue(mockUser as any);
      mockUserRepository.deleteUser.mockResolvedValue(mockUser as any);

      await service.deleteUser('1');

      expect(mockUploadService.removeFile).not.toHaveBeenCalled();
      expect(mockUserRepository.deleteUser).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
