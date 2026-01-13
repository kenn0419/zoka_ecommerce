import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { Prisma } from 'generated/prisma';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildUserSort } from 'src/common/utils/user-sort.util';
import { PaginatedSort } from 'src/common/enums/paginated-sort.enum';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
    private userRepo: UserRepository,
  ) {}

  async createUser(data: CreateUserDto, file?: Express.Multer.File) {
    const existUserByEmail = await this.userRepo.findUnique({
      email: data.email,
    });
    if (existUserByEmail) {
      throw new ConflictException(`Exist user with this email`);
    }

    const existUserByPhone = await this.userRepo.findUnique({
      phone: data.phone,
    });
    if (existUserByPhone) {
      throw new ConflictException(`Exist user with this phone`);
    }

    const saltRounds = Number(
      this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10),
    );
    const hashedPassword = await bcrypt.hashSync(data.password, saltRounds);

    let avatarUrl: string | null = null;
    if (file) {
      const upload = await this.uploadService.uploadFile(
        file,
        this.configService.get<string>('SUPABASE_BUCKET_FOLDER_USER'),
      );
      avatarUrl = upload.url;
    }

    const newUser = await this.userRepo.create({
      email: data.email,
      hashedPassword,
      phone: data.phone,
      fullName: data.fullName,
      slug: slugify(data.fullName, { lower: true }) + '-' + crypto.randomUUID(),
      address: data.address,
      avatarUrl,
    });

    return newUser;
  }

  async findAllUsers(
    search: string,
    page: number,
    limit: number,
    sort: PaginatedSort,
  ) {
    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: buildSearchOr(search, ['name', 'address']),
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildUserSort(sort),
      },
      (args) => this.userRepo.listPaginatedUsers(args),
    );
  }

  async findUser(id: string) {
    const existUser = await this.userRepo.findUnique({ id });
    if (!existUser) {
      throw new NotFoundException(`User not found`);
    }

    return existUser;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const existUser = await this.findUser(id);
    const existUserByEmail = await this.userRepo.findUnique({
      email: data.email,
    });
    if (existUserByEmail && existUserByEmail.id !== existUser.id) {
      throw new ConflictException(`Exist user with this email`);
    }

    const existUserByPhone = await this.userRepo.findUnique({
      phone: data.phone,
    });
    if (existUserByPhone) {
      throw new ConflictException(`Exist user with this phone`);
    }

    return await this.userRepo.updateUser({ id }, data);
  }

  async activeUser(id: string) {
    return this.userRepo.changeUserStatus({ id }, UserStatus.ACTIVE);
  }

  async deactive(id: string) {
    return this.userRepo.changeUserStatus({ id }, UserStatus.INACTIVE);
  }

  async deleteUser(id: string) {
    const existUser = await this.findUser(id);
    const avatarUrl = existUser?.avatarUrl;

    if (avatarUrl) {
      const bucket = this.configService.get<string>('SUPABASE_BUCKET')!;
      const filePath = avatarUrl.split(bucket + '/')[1];
      if (filePath) {
        await this.uploadService.removeFile(filePath);
      }
    }

    return await this.userRepo.deleteUser({ id });
  }
}
