import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = process.env.SUPABASE_BUCKET_FOLDER_USER!,
  ) {
    const bucket = process.env.SUPABASE_BUCKET!;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExt}`;
    const { error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new BadRequestException(`Upload failed: ${error.message}`);

    const { data } = this.supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: data.publicUrl };
  }

  async removeFile(fileUrl?: string) {
    if (fileUrl) {
      const { error: deleteError } = await this.supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .remove([fileUrl]);

      if (deleteError) {
        console.warn('Không thể xoá ảnh cũ:', deleteError.message);
      }
    }
  }
}
