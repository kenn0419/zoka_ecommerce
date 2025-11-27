import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRepository } from '../user/repositories/user.repository';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/infrastructure/upload/upload.service';
@Injectable()
export class ProfileService {
  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
    private userRepo: UserRepository,
  ) {}

  getProfile(id: string) {
    return this.userRepo.findUnique({ id });
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    return await this.userRepo.updateUser({ id }, updateProfileDto);
  }

  async changePassword(id: string, data: ChangePasswordDto) {
    const exisedUser = await this.userRepo.findUnique({ id });
    if (!exisedUser) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      data.oldPassword,
      exisedUser.hashedPassword,
    );
    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(
      data.newPassword,
      Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS')),
    );

    await this.userRepo.updateUser({ id }, { hashedPassword });
  }

  async changeAvatar(id: string, file?: Express.Multer.File) {
    const existedUser = await this.userRepo.findUnique({ id });
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }
    let avatarUrl: string | null = null;
    if (file) {
      const upload = await this.uploadService.uploadFile(
        file,
        this.configService.get<string>('SUPABASE_BUCKET_FOLDER_USER'),
      );
      avatarUrl = upload.url;

      if (existedUser?.avatarUrl) {
        const bucket = this.configService.get<string>('SUPABASE_BUCKET')!;
        const filePath = existedUser?.avatarUrl.split(bucket + '/')[1];
        if (filePath) {
          await this.uploadService.removeFile(filePath);
        }
      }
    }

    return this.userRepo.updateUser({ id }, { avatarUrl });
  }
}
