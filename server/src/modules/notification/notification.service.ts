import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotificationType } from '@prisma/client';
import { ShopFollowerRepository } from '../shop-follower/shop-follower.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly shopFollowerRepo: ShopFollowerRepository,
  ) {}

  async notifyUser(
    receiverId: string,
    content: string,
    type: NotificationType,
    senderId?: string,
    url?: string,
    metadata?: any,
  ) {
    return this.notificationRepo.create({
      receiverId,
      senderId,
      content,
      type,
      url,
      metadata,
    });
  }

  async notifyFollowersOfShop(
    shopId: string,
    content: string,
    type: NotificationType,
    url?: string,
    metadata?: any,
  ) {
    const followers = await this.shopFollowerRepo.findFollowerByShopId(shopId);
    if (!followers.length) return;

    await this.notificationRepo.createMany(
      followers.map((f) => ({
        receiverId: f.userId,
        content,
        type,
        url,
        metadata,
      })),
    );
  }

  async getUserNotifications(userId: string, page = 1, limit = 10) {
    const [items, unreadCount] = await Promise.all([
      this.notificationRepo.findByUser(userId, page, limit),
      this.notificationRepo.countUnread(userId),
    ]);

    return {
      items,
      unreadCount,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationRepo.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepo.markAllAsRead(userId);
  }
}
