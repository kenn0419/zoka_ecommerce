import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  
  // Variables for sharing state across tests
  let testUserId: string;
  let testUserEmail = `zoka.e2e.${Date.now()}@example.com`;
  let testUserPhone = `098${Math.floor(1000000 + Math.random() * 8999999)}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Override guards to bypass JWT checking for quick e2e controller testing
      .overrideGuard(JwtSessionGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesPermissionsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Teardown: Clean up the created data so we don't mess up the database
    if (testUserId) {
      await prisma.address.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } });
    }
    await app.close();
  });

  describe('/users (POST) - Create User', () => {
    it('should create a new user successfully and return user data', () => {
      const createUserDto = {
        email: testUserEmail,
        password: 'Password123',
        phone: testUserPhone,
        fullName: 'E2E Test User',
        address: '123 E2E Street, Ward, District, City',
        birthday: '1990-01-01T00:00:00.000Z'
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect((res) => {
          if (res.status !== 201) console.log('ERROR:', res.body);
          expect(res.status).toBe(201);
          
          // Assertions on the response body structure
          expect(res.body.message).toBe('Create user successfully!');
          expect(res.body.data).toBeDefined();
          expect(res.body.data.email).toBe(testUserEmail);
          expect(res.body.data.fullName).toBe('E2E Test User');
          
          // Save the ID for subsequent tests
          testUserId = res.body.data.id;
        });
    });

    it('should fail with ConflictException (409) if email is duplicated', () => {
      const createUserDto = {
        email: testUserEmail, // Duplicate email
        password: 'NewPassword123',
        phone: `098${Math.floor(1000000 + Math.random() * 8999999)}`,
        fullName: 'Another E2E User',
        address: '123 E2E Street, Ward, District, City',
        birthday: '1990-01-01T00:00:00.000Z'
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toBe('Exist user with this email');
        });
    });
  });

  describe('/users (GET) - Find All Users', () => {
    it('should return a paginated list of users', () => {
      return request(app.getHttpServer())
        .get('/users?page=1&limit=10')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Find all users successfully!');
          expect(res.body.data.items).toBeDefined();
          expect(res.body.data.totalItems).toBeDefined();
          expect(Array.isArray(res.body.data.items)).toBe(true);
          
          // We know at least our recently created user is there
          expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
        });
    });
  });

  describe('/users/:id (GET) - Find User', () => {
    it('should fetch the created user by ID', () => {
      return request(app.getHttpServer())
        .get(`/users/${testUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Find user by id');
          expect(res.body.data.id).toBe(testUserId);
          expect(res.body.data.email).toBe(testUserEmail);
        });
    });

    it('should throw NotFoundException (404) for invalid ID', () => {
      return request(app.getHttpServer())
        .get(`/users/invalid-id-that-does-not-exist`)
        .expect(404);
    });
  });

  describe('/users/:id (PUT) - Update User', () => {
    it('should update the user data', () => {
      return request(app.getHttpServer())
        .put(`/users/${testUserId}`)
        .send({
          fullName: 'E2E Test User Updated',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Update user successfully!');
          expect(res.body.data.fullName).toBe('E2E Test User Updated');
        });
    });
  });

  describe('/users/:id/deactive (PATCH) - Deactive User', () => {
    it('should change status to INACTIVE', () => {
      return request(app.getHttpServer())
        .patch(`/users/${testUserId}/deactive`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Deactive user successfully!');
          expect(res.body.data.status).toBe(UserStatus.INACTIVE);
        });
    });
  });

  describe('/users/:id/active (PATCH) - Active User', () => {
    it('should change status to ACTIVE', () => {
      return request(app.getHttpServer())
        .patch(`/users/${testUserId}/active`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Active user successfully!');
          expect(res.body.data.status).toBe(UserStatus.ACTIVE);
        });
    });
  });
});
