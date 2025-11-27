import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtSessionGuard } from '../../common/guards/jwt-session.guard';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
@UseGuards(JwtSessionGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Serialize(UserResponseDto, 'Get profile successfully!')
  getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Patch()
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Patch('/change-password')
  @Serialize(null, 'Change password successfully!')
  changePassword(@Req() req, @Body() data: ChangePasswordDto) {
    return this.profileService.changePassword(req.user.userId, data);
  }

  @Patch('/change-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @Serialize(UserResponseDto, 'Change avatar successfully!')
  changeAvatar(@Req() req, @UploadedFile() file?: Express.Multer.File) {
    return this.profileService.changeAvatar(req.user.userId, file);
  }
}
