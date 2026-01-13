import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import slugify from 'slugify';
import { CategoryStatus } from 'src/common/enums/category-status.enum';
import { buildCategorySort } from 'src/common/utils/category-sort.util';
import { CategorySort } from 'src/common/enums/category-sort.enum';
import { Prisma } from 'generated/prisma';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';

@Injectable()
export class CategoryService {
  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
    private categoryRepository: CategoryRepository,
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
    return this.categoryRepository.createCategory({
      ...data,
      slug: slugify(data.name, { lower: true }) + '-' + crypto.randomUUID(),
      thumbnailUrl: thumbnailUrl ?? '',
      status: CategoryStatus.PENDING,
    });
  }

  async findAllCategories(
    search: string,
    page: number,
    limit: number,
    sort: CategorySort,
  ) {
    const orderBy = buildCategorySort(sort);

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
  }

  async findOne(slug: string) {
    const category = await this.categoryRepository.findUnique({ slug });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(slug: string, dto: UpdateCategoryDto) {
    await this.findOne(slug);
    return this.categoryRepository.update(slug, dto);
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
    return this.categoryRepository.delete(slug);
  }

  activate(slug: string) {
    return this.categoryRepository.activate(slug);
  }

  deactivate(slug: string) {
    return this.categoryRepository.deactivate(slug);
  }

  getTree() {
    return this.categoryRepository.findRootCategories();
  }

  getChildren(slug: string) {
    return this.categoryRepository.findChildren(slug);
  }
}
