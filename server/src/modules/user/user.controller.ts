import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtSessionGuard } from '../../common/guards/jwt-session.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';

@Controller('user')
@Roles(Role.ADMIN)
@UseGuards(JwtSessionGuard, RolesPermissionsGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @Serialize(UserResponseDto, 'Create user successfully!')
  createUser(
    @Body() data: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.createUser(data, file);
  }

  @Get()
  @Serialize(UserResponseDto, 'Find all users successfully!')
  findAllUsers(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), PositiveIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(20), PositiveIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe('id,asc')) sort: string,
  ) {
    return this.userService.findAllUsers(search, page, limit, sort);
  }

  @Get(':slug')
  @Serialize(UserResponseDto, 'Find user by slug')
  findUser(@Param('slug') slug: string) {
    return this.userService.findUser(slug);
  }

  @Put(':slug')
  @Serialize(UserResponseDto, 'Update user successfully!')
  updateUser(@Param('slug') slug: string, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(slug, data);
  }

  @Patch(':slug/active')
  @Serialize(UserResponseDto, 'Active user successfully!')
  activeUser(@Param('slug') slug: string) {
    return this.userService.activeUser(slug);
  }

  @Patch(':slug/deactive')
  @Serialize(UserResponseDto, 'Deactive user successfully!')
  deactiveUser(@Param('slug') slug: string) {
    return this.userService.deactive(slug);
  }

  @Delete(':slug')
  @Serialize(null, 'Delete user successfully!')
  deleteUser(@Param('slug') slug: string) {
    this.userService.deleteUser(slug);
  }
}
