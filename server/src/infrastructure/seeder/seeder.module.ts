import { Module, OnModuleInit } from '@nestjs/common';
import { RbacSeeder } from './rbac.seeder';
import { UserSeeder } from './user.seeder';
import { RbacModule } from 'src/modules/rbac/rbac.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [RbacModule, UserModule],
  providers: [RbacSeeder, UserSeeder],
})
export class SeederModule implements OnModuleInit {
  constructor(
    private rbacSeeder: RbacSeeder,
    private userSeeder: UserSeeder,
  ) {}

  async onModuleInit() {
    await this.rbacSeeder.seed();
    await this.userSeeder.seed();
  }
}
