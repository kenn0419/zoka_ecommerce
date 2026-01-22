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
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
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
import { ParseJsonPipe } from 'src/common/pipes/parse-json.pipe';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Controller('products')
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
    @Body('data') dataRaw: string,
  ) {
    const data = plainToInstance(CreateProductDto, JSON.parse(dataRaw), {
      enableImplicitConversion: true,
    });

    const errors = validateSync(data, {
      whitelist: true,
    });

    if (errors.length) {
      throw new BadRequestException(errors);
    }
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
  findAllProducts(
    @Query()
    {
      search,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      rating,
    }: ProductListQueryDto,
  ) {
    return this.productService.findAllProduct(
      search,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      rating,
    );
  }

  @Get('/active')
  @SerializePaginated(ProductListResponseDto, 'Get all products successfully.')
  @HttpCode(HttpStatus.OK)
  findAllActiveProducts(
    @Query()
    {
      search,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      rating,
    }: ProductListQueryDto,
  ) {
    return this.productService.findAllActiveProduct(
      search,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      rating,
    );
  }

  @Get('/suggest')
  @SerializePaginated(
    ProductListResponseDto,
    'Get suggest products successfully.',
  )
  @HttpCode(HttpStatus.OK)
  findAllSuggestProducts(@Query('search') search: string) {
    return this.productService.findSuggestProducts(search);
  }

  @Get('/category/:categorySlug')
  @HttpCode(HttpStatus.OK)
  @SerializePaginated(
    ProductListResponseDto,
    'Get all products by category successfully.',
  )
  findAllProductsByCategory(
    @Param('categorySlug') slug: string,
    @Query()
    {
      search,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      rating,
    }: ProductListQueryDto,
  ) {
    return this.productService.findAllProductByCategory(
      slug,
      search,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      rating,
    );
  }

  @Get('/shop/:shopId')
  @Roles(Role.SHOP)
  @UseGuards(JwtSessionGuard, RolesPermissionsGuard)
  @SerializePaginated(
    ProductListResponseDto,
    'Get products by shop successfully.',
  )
  @HttpCode(HttpStatus.OK)
  findProductsByShop(
    @Req() req,
    @Param('shopId') shopId,
    @Query()
    { search, page, limit, sort }: ProductListQueryDto,
  ) {
    return this.productService.findProductsByShop(
      shopId,
      req.user.userId,
      search,
      page,
      limit,
      sort,
    );
  }

  @Get('/active/shop/:shopSlug')
  @SerializePaginated(
    ProductListResponseDto,
    'Get products by shop successfully.',
  )
  @HttpCode(HttpStatus.OK)
  findActiveShopProducts(
    @Param('shopSlug') shopId,
    @Query()
    { search, page, limit, sort }: ProductListQueryDto,
  ) {
    return this.productService.findActiveShopProducts(
      shopId,
      search,
      page,
      limit,
      sort,
    );
  }

  @Get('/public/detail/:slug')
  @Serialize(ProductDetailResponseDto, 'Get product detail successfully.')
  @HttpCode(HttpStatus.OK)
  findProductDetailBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('/internal/detail/:id')
  @UseGuards(JwtSessionGuard, RolesPermissionsGuard)
  @Roles(Role.ADMIN, Role.SHOP)
  @Serialize(ProductDetailResponseDto, 'Get product detail successfully.')
  @HttpCode(HttpStatus.OK)
  async findProductDetailById(@Req() req, @Param('id') id: string) {
    const product = await this.productService.findById(id);
    const userId = req.user.userId;
    const isAccess =
      req.user.roles.includes(Role.SHOP) && product.shop.owner.id === userId;

    if (!isAccess) {
      throw new BadRequestException('Access denied.');
    }
    return product;
  }

  @Patch('/:id')
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
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },
  ) {
    return this.productService.update(
      id,
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
