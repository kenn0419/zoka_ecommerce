import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import slugify from 'slugify';
import { buildCategorySort } from 'src/common/utils/category-sort.util';
import { CategoryStatus, Prisma } from '@prisma/client';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { CategorySort } from 'src/common/enums/category.enum';
import { RedisService } from 'src/infrastructure/redis/redis.service';

@Injectable()
export class CategoryService {
  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
    private categoryRepository: CategoryRepository,
    private redisService: RedisService,
  ) {}

  async createCategory(data: CreateCategoryDto, file?: Express.Multer.File) {
    let thumbnailUrl: string | null = null;
    if (file) {
      const upload = await this.uploadService.uploadFile(
        file,
        this.configService.get<string>('SUPABASE_BUCKET_FOLDER_CATEGORY'),
      );
      thumbnailUrl = upload.url;
    }
    const result = await this.categoryRepository.createCategory({
      ...data,
      slug: slugify(data.name, { lower: true }) + '-' + crypto.randomUUID(),
      thumbnailUrl: thumbnailUrl ?? '',
      status: CategoryStatus.PENDING,
    });
    
    await this.clearCategoryCaches();
    return result;
  }

  private async clearCategoryCaches() {
    await this.redisService.delByPattern('category:tree');
    await this.redisService.delByPattern('category:active:*');
  }

  async findAllCategories(
    search: string,
    page: number,
    limit: number,
    sort: CategorySort,
  ) {
    const where: Prisma.CategoryWhereInput = {
      ...(search && {
        OR: buildSearchOr(search, ['id', 'name', 'description']),
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildCategorySort(sort),
      },
      (args) => this.categoryRepository.listPagninated(args),
    );
  }

  async findAllActiveCategories(
    search: string,
    page: number,
    limit: number,
    sort: CategorySort,
  ) {
    const cacheKey = `category:active:${page}:${limit}:${sort}:${search || 'none'}`;
    
    return this.redisService.getOrSet(cacheKey, async () => {
      const where: Prisma.CategoryWhereInput = {
        status: CategoryStatus.ACTIVE,
        ...(search && {
          OR: buildSearchOr(search, ['id', 'name', 'description']),
        }),
      };

      return paginatedResult(
        {
          where,
          page,
          limit,
          orderBy: buildCategorySort(sort),
        },
        (args) => this.categoryRepository.listPagninated(args),
      );
    });
  }

  async findOne(slug: string) {
    const category = await this.categoryRepository.findUnique({ slug });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(slug: string, dto: UpdateCategoryDto) {
    await this.findOne(slug);
    const result = await this.categoryRepository.update(slug, dto);
    await this.clearCategoryCaches();
    return result;
  }

  async remove(slug: string) {
    const existCategory = await this.findOne(slug);
    // if (existCategory) {
    //   const thumbnailUrl = existCategory?.thumbnailUrl;

    //   if (thumbnailUrl) {
    //     const bucket = this.configService.get<string>('SUPABASE_BUCKET')!;
    //     const filePath = thumbnailUrl.split(bucket + '/')[1];
    //     if (filePath) {
    //       await this.uploadService.removeFile(filePath);
    //     }
    //   }
    // }
    const result = await this.categoryRepository.delete(slug);
    await this.clearCategoryCaches();
    return result;
  }

  async activate(slug: string) {
    const result = await this.categoryRepository.activate(slug);
    await this.clearCategoryCaches();
    return result;
  }

  async deactivate(slug: string) {
    const result = await this.categoryRepository.deactivate(slug);
    await this.clearCategoryCaches();
    return result;
  }

  async getTree() {
    return this.redisService.getOrSet('category:tree', () => this.categoryRepository.findRootCategories());
  }

  getChildren(slug: string) {
    return this.categoryRepository.findChildren(slug);
  }
}
