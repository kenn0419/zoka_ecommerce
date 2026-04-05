import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CHAT_AI_AGENT_ID } from 'src/common/constants/ai-agent.constant';

@Injectable()
export class ConversationRepository {
  constructor(public readonly prisma: PrismaService) {}

  findByIdAndUser(conversationId: string, userId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    });
  }

  findUserConversations(userId: string, cursor?: string, limit = 10) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        buyer: true,
        seller: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });
  }

  findUnique(
    where: Prisma.ConversationWhereUniqueInput,
    select?: Prisma.ConversationSelect,
  ) {
    return this.prisma.conversation.findUnique({ where, select });
  }

  findConversation(sellerId: string, buyerId: string) {
    return this.prisma.conversation.findFirst({
      where: {
        buyerId,
        sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  ensureConversationWithAdmin(userId: string, adminId: string) {
    return this.prisma.conversation.upsert({
      where: {
        buyerId_sellerId: {
          buyerId: userId,
          sellerId: adminId,
        },
      },
      update: {},
      create: {
        buyerId: userId,
        sellerId: adminId,
      },
    });
  }

  ensureConversationWithAI(userId: string) {
    return this.prisma.conversation.upsert({
      where: {
        buyerId_sellerId: {
          buyerId: userId,
          sellerId: CHAT_AI_AGENT_ID,
        },
      },
      update: {},
      create: {
        buyerId: userId,
        sellerId: CHAT_AI_AGENT_ID,
      },
    });
  }

  updateConversation(
    where: Prisma.ConversationWhereUniqueInput,
    data: Prisma.ConversationUpdateInput,
  ) {
    return this.prisma.conversation.update({ where, data });
  }
}
