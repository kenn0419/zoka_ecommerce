import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    receiverId: string;
    senderId?: string;
    content: string;
    type: NotificationType;
    url?: string;
    metadata?: any;
  }) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== null,
      ),
    );
    return this.prisma.notification.create({
      data: cleanData as any,
    });
  }

  async createMany(
    data: {
      receiverId: string;
      senderId?: string;
      content: string;
      type: NotificationType;
      url?: string;
      metadata?: any;
    }[],
  ) {
    const cleanData = data.map((item) =>
      Object.fromEntries(
        Object.entries(item).filter(([, value]) => value !== undefined),
      ),
    );
    return this.prisma.notification.createMany({
      data: cleanData as any,
    });
  }

  async findByUser(userId: string, page: number, limit: number) {
    return this.prisma.notification.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        receiverId: userId,
      },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }
}
