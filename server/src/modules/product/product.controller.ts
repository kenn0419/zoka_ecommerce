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
  UploadedFiles,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { ProductResponseDto } from './dto/product-response.dto';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';
import { ProductSort } from 'src/common/enums/product-sort.enum';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.SHOP)
  @UseGuards(JwtSessionGuard, RolesPermissionsGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'variantImages', maxCount: 20 },
    ]),
  )
  @Serialize(
    ProductResponseDto,
    'Create product successfully. Please wait admin for apporving!',
  )
  create(
    @Req() req,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },
    @Body() data: CreateProductDto,
  ) {
    return this.productService.create(
      req.user.userId,
      data,
      files.thumbnail?.[0] ?? null,
      files.variantImages ?? [],
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtSessionGuard, RolesPermissionsGuard)
  @Serialize(ProductResponseDto, 'Get all products successfully.')
  findAllProducts(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), PositiveIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(20), PositiveIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe(ProductSort.OLDEST)) sort: ProductSort,
  ) {
    return this.productService.findAllProduct(search, page, limit, sort);
  }

  @Get('/active')
  @Serialize(ProductResponseDto, 'Get all products successfully.')
  findAllActiveProducts(
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), PositiveIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(20), PositiveIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe(ProductSort.OLDEST)) sort: ProductSort,
  ) {
    return this.productService.findAllActiveProduct(search, page, limit, sort);
  }

  @Get('/:categorySlug')
  findAllProductsByCategory(@Param('categorySlug') slug: string) {
    return this.productService.findAllProductByCategory(slug);
  }

  @Get(':slug')
  findProducDetail(@Param('slug') slug: string) {
    return this.productService.findOne(slug);
  }

  @Patch(':slug')
  @Roles(Role.SHOP)
  @UseGuards(JwtSessionGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'variantImages', maxCount: 20 },
    ]),
  )
  update(
    @Param('slug') slug: string,
    @Body() data: UpdateProductDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },
  ) {
    return this.productService.update(
      slug,
      data,
      files.thumbnail?.[0],
      files.variantImages,
    );
  }

  @Delete(':slug')
  @Roles(Role.SHOP)
  @UseGuards(JwtSessionGuard)
  remove(@Param('slug') slug: string) {
    return this.productService.remove(slug);
  }
}
