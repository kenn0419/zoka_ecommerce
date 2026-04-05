import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

import { JwtSessionGuard } from '../../common/guards/jwt-session.guard';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';

const mockUserService = {
  createUser: jest.fn(),
  findAllUsers: jest.fn(),
  findUser: jest.fn(),
  updateUser: jest.fn(),
  activeUser: jest.fn(),
  deactive: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtSessionGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesPermissionsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should call userService.createUser', async () => {
      const dto = new CreateUserDto();
      const file = {} as Express.Multer.File;
      const expectedResult = { id: '1' };
      mockUserService.createUser.mockResolvedValue(expectedResult);

      const result = await controller.createUser(dto, file);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.createUser).toHaveBeenCalledWith(dto, file);
    });
  });

  describe('findAllUsers', () => {
    it('should call userService.findAllUsers with correct pagination queries', async () => {
      const queryParams: PaginatedQueryDto = {
        page: 1,
        limit: 10,
        search: 'test',
      };
      const expectedResult = { items: [], totalItems: 0 };
      mockUserService.findAllUsers.mockResolvedValue(expectedResult);

      const result = await controller.findAllUsers(queryParams);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.findAllUsers).toHaveBeenCalledWith(
        queryParams.search,
        queryParams.page,
        queryParams.limit,
        queryParams.sort,
      );
    });
  });

  describe('findUser', () => {
    it('should call userService.findUser', async () => {
      const expectedResult = { id: '1' };
      mockUserService.findUser.mockResolvedValue(expectedResult);

      const result = await controller.findUser('1');

      expect(result).toEqual(expectedResult);
      expect(mockUserService.findUser).toHaveBeenCalledWith('1');
    });
  });

  describe('updateUser', () => {
    it('should call userService.updateUser', async () => {
      const dto = { fullName: 'New Name' } as any;
      const expectedResult = { id: '1', fullName: 'New Name' };
      mockUserService.updateUser.mockResolvedValue(expectedResult);

      const result = await controller.updateUser('1', dto);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('activeUser', () => {
    it('should call userService.activeUser', async () => {
      const expectedResult = { id: '1', status: 'ACTIVE' };
      mockUserService.activeUser.mockResolvedValue(expectedResult);

      const result = await controller.activeUser('1');

      expect(result).toEqual(expectedResult);
      expect(mockUserService.activeUser).toHaveBeenCalledWith('1');
    });
  });

  describe('deactiveUser', () => {
    it('should call userService.deactive', async () => {
      const expectedResult = { id: '1', status: 'INACTIVE' };
      mockUserService.deactive.mockResolvedValue(expectedResult);

      const result = await controller.deactiveUser('1');

      expect(result).toEqual(expectedResult);
      expect(mockUserService.deactive).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteUser', () => {
    it('should call userService.deleteUser', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);

      await controller.deleteUser('1');

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
    });
  });
});
