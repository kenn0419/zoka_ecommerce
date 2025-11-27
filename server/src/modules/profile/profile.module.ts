import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { UploadModule } from 'src/infrastructure/upload/upload.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UploadModule, UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
