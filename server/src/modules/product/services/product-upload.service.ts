import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadService } from 'src/infrastructure/upload/upload.service';

@Injectable()
export class ProductUploadService {
  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
  ) {}

  async uploadProductAssets(
    thumbnailFile: Express.Multer.File,
    variantFiles: Express.Multer.File[],
  ) {
    const folder = this.configService.get<string>(
      'SUPABASE_BUCKET_FOLDER_PRODUCT',
    );

    const [thumbnail, ...variantImages] = await Promise.all([
      this.uploadService.uploadFile(thumbnailFile, folder),
      ...variantFiles.map((f) => this.uploadService.uploadFile(f, folder)),
    ]);

    return { thumbnail, variantImages };
  }

  async uploadSingleFile(file: Express.Multer.File) {
    const folder = this.configService.get<string>(
      'SUPABASE_BUCKET_FOLDER_PRODUCT',
    );
    return this.uploadService.uploadFile(file, folder);
  }
}
