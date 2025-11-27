import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { UserModule } from '../user/user.module';
import { RbacModule } from '../rbac/rbac.module';
import { UploadModule } from 'src/infrastructure/upload/upload.module';
import { ShopRepository } from './shop.repository';

@Module({
  imports: [UserModule, RbacModule, UploadModule],
  exports: [ShopRepository],
  controllers: [ShopController],
  providers: [ShopService, ShopRepository],
})
export class ShopModule {}
