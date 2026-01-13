import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtSessionGuard } from '../../common/guards/jwt-session.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

@Controller('users')
@UseGuards(JwtSessionGuard, RolesPermissionsGuard)
@Roles(Role.ADMIN)
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
  @HttpCode(HttpStatus.OK)
  @SerializePaginated(UserResponseDto, 'Find all users successfully!')
  findAllUsers(@Query() query: PaginatedQueryDto) {
    return this.userService.findAllUsers(
      query.search,
      query.page,
      query.limit,
      query.sort,
    );
  }

  @Get(':id')
  @Serialize(UserResponseDto, 'Find user by id')
  findUser(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @Put(':id')
  @Serialize(UserResponseDto, 'Update user successfully!')
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(id, data);
  }

  @Patch(':id/active')
  @Serialize(UserResponseDto, 'Active user successfully!')
  activeUser(@Param('id') id: string) {
    return this.userService.activeUser(id);
  }

  @Patch(':id/deactive')
  @Serialize(UserResponseDto, 'Deactive user successfully!')
  deactiveUser(@Param('id') id: string) {
    return this.userService.deactive(id);
  }

  @Delete(':id')
  @Serialize(null, 'Delete user successfully!')
  deleteUser(@Param('id') id: string) {
    this.userService.deleteUser(id);
  }
}
