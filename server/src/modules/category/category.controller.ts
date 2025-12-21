import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { CategoryResponseDto } from './dto/category-response.dto';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CategorySort } from 'src/common/enums/category-sort.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtSessionGuard)
  @UseInterceptors(FileInterceptor(`thumbnail`))
  @Serialize(CategoryResponseDto, `Create new category successfully!`)
  create(
    @Body() data: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.categoryService.createCategory(data, file);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtSessionGuard)
  @Serialize(CategoryResponseDto, `Find all categories successfully!`)
  findAllCategories(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), PositiveIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(20), PositiveIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe(CategorySort.NAME_ASC))
    sort: CategorySort,
  ) {
    return this.categoryService.findAllCategories(search, page, limit, sort);
  }

  @Get('active')
  @Serialize(CategoryResponseDto, `Find all active categories successfully!`)
  findAllActiveCategories(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), PositiveIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(20), PositiveIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe(CategorySort.NAME_ASC))
    sort: CategorySort,
  ) {
    return this.categoryService.findAllActiveCategories(
      search,
      page,
      limit,
      sort,
    );
  }

  @Get('tree')
  @Serialize(CategoryResponseDto, `Find all tree successfully!`)
  getTree() {
    return this.categoryService.getTree();
  }

  @Get(':slug/children')
  @Serialize(CategoryResponseDto, `Find category's children successfully!`)
  getChildren(@Param('slug') slug: string) {
    return this.categoryService.getChildren(slug);
  }

  @Get(':slug')
  @Serialize(CategoryResponseDto, `Find category successfully!`)
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findOne(slug);
  }

  @Patch(':slug')
  @Roles(Role.ADMIN)
  @UseGuards(JwtSessionGuard)
  @Serialize(CategoryResponseDto, `Update category successfully!`)
  update(@Param('slug') slug: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(slug, dto);
  }

  @Patch(':slug/activate')
  @Roles(Role.ADMIN)
  @UseGuards(JwtSessionGuard)
  @Serialize(CategoryResponseDto, `Active category successfully!`)
  activate(@Param('slug') slug: string) {
    return this.categoryService.activate(slug);
  }

  @Patch(':slug/deactivate')
  @Roles(Role.ADMIN)
  @UseGuards(JwtSessionGuard)
  @Serialize(CategoryResponseDto, `Deactive category successfully!`)
  deactivate(@Param('slug') slug: string) {
    return this.categoryService.deactivate(slug);
  }

  @Delete(':slug')
  @Roles(Role.ADMIN)
  @UseGuards(JwtSessionGuard)
  @Serialize(null, 'Delete category successfully')
  remove(@Param('slug') slug: string) {
    return this.categoryService.remove(slug);
  }
}
