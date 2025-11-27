import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { RbacService } from 'src/modules/rbac/rbac.service';

@Injectable()
export class UserSeeder {
  constructor(
    private userRepo: UserRepository,
    private rbacService: RbacService,
  ) {}

  async seed() {
    const users = await this.userRepo.findAllUsers();
    if (users.length == 0) {
      const admin = await this.userRepo.create({
        id: crypto.randomUUID(),
        fullName: 'Admin',
        email: 'admin@gmail.com',
        slug: 'admin',
        phone: '076259919',
        hashedPassword: bcrypt.hashSync('123123az', 10),
        address: '',
        status: 'ACTIVE',
      });
      await this.rbacService.assignRole(admin.id, 'admin');
    }
    console.log('✅ User seeding completed.');
  }
}
