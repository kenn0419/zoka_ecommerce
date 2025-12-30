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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { ProductListQueryDto } from './dto/product-query.dto';
import { ProductListResponseDto } from './dto/product-list-item-response.dto';
import { ProductDetailResponseDto } from './dto/product-detail-response.dto';

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
    ProductListResponseDto,
    'Create product successfully. Please wait admin for apporving!',
  )
  @HttpCode(HttpStatus.CREATED)
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
  @SerializePaginated(ProductListResponseDto, 'Get all products successfully.')
  @HttpCode(HttpStatus.OK)
  findAllProducts(@Query() { search, page, limit, sort }: ProductListQueryDto) {
    return this.productService.findAllProduct(search, page, limit, sort);
  }

  @Get('/active')
  @SerializePaginated(ProductListResponseDto, 'Get all products successfully.')
  @HttpCode(HttpStatus.OK)
  findAllActiveProducts(
    @Query() { search, page, limit, sort }: ProductListQueryDto,
  ) {
    return this.productService.findAllActiveProduct(search, page, limit, sort);
  }

  @Get('/suggest')
  @SerializePaginated(
    ProductListResponseDto,
    'Get suggest products successfully.',
  )
  @HttpCode(HttpStatus.OK)
  findAllSuggestProducts(@Query('keyword') keyword: string) {
    return this.productService.findSuggestProducts(keyword);
  }

  @Get('/category/:categorySlug')
  @HttpCode(HttpStatus.OK)
  @SerializePaginated(
    ProductListResponseDto,
    'Get all products by category successfully.',
  )
  findAllProductsByCategory(
    @Param('categorySlug') slug: string,
    @Query() { search, page, limit, sort }: ProductListQueryDto,
  ) {
    return this.productService.findAllProductByCategory(
      slug,
      search,
      page,
      limit,
      sort,
    );
  }

  @Get('/detail/:slug')
  @Serialize(ProductDetailResponseDto, 'Get product detail successfully.')
  @HttpCode(HttpStatus.OK)
  findProducDetail(@Param('slug') slug: string) {
    return this.productService.findOne(slug);
  }

  @Patch('/:slug')
  @Roles(Role.SHOP)
  @UseGuards(JwtSessionGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'variantImages', maxCount: 20 },
    ]),
  )
  @HttpCode(HttpStatus.ACCEPTED)
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

  @Delete('/:slug')
  @Roles(Role.SHOP)
  @UseGuards(JwtSessionGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  remove(@Param('slug') slug: string) {
    return this.productService.remove(slug);
  }
}
