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

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
    private userRepository: UserRepository,
  ) {}

  async createUser(data: CreateUserDto, file?: Express.Multer.File) {
    const existUserByEmail = await this.userRepository.findByEmail(data.email);
    if (existUserByEmail) {
      throw new ConflictException(`Exist user with this email`);
    }

    const existUserByPhone = await this.userRepository.findByPhone(data.phone);
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

    const newUser = await this.userRepository.create({
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
    sort: string,
  ) {
    const take = limit;
    const skip = (page - 1) * take;
    const sortBy = sort.split(',');
    const users = await this.userRepository.findAllUsers(
      search,
      take,
      skip,
      sortBy,
    );
    return users;
  }

  async findUser(slug: string) {
    const existUserBySlug = await this.userRepository.findUnique({ slug });
    if (!existUserBySlug) {
      throw new NotFoundException(`User not found`);
    }

    return existUserBySlug;
  }

  async updateUser(slug: string, data: UpdateUserDto) {
    const existUserBySlug = await this.findUser(slug);
    const existUserByEmail = await this.userRepository.findByEmail(data.email);
    if (existUserByEmail && existUserByEmail.slug !== existUserBySlug.slug) {
      throw new ConflictException(`Exist user with this email`);
    }

    const existUserByPhone = await this.userRepository.findByPhone(data.phone);
    if (existUserByPhone) {
      throw new ConflictException(`Exist user with this phone`);
    }

    return await this.userRepository.updateUser({ slug }, data);
  }

  async activeUser(slug: string) {
    return this.userRepository.changeUserStatus({ slug }, UserStatus.ACTIVE);
  }

  async deactive(slug: string) {
    return this.userRepository.changeUserStatus({ slug }, UserStatus.INACTIVE);
  }

  async deleteUser(slug: string) {
    const existUser = await this.findUser(slug);
    const avatarUrl = existUser?.avatarUrl;

    if (avatarUrl) {
      const bucket = this.configService.get<string>('SUPABASE_BUCKET')!;
      const filePath = avatarUrl.split(bucket + '/')[1];
      if (filePath) {
        await this.uploadService.removeFile(filePath);
      }
    }

    return await this.userRepository.deleteUser({ slug });
  }
}
