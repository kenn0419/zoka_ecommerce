import { ProductRepository } from '../product/repositories/product.repository';
import { CategoryRepository } from '../category/category.repository';
import { ChatRequestDto } from './dto/chat-request.dto';
import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { aiTools } from './ai-tools';
import { CHAT_AI_AGENT_ID, CHAT_AI_AGENT_NAME, CHAT_AI_AGENT_EMAIL, CHAT_AI_AGENT_AVATAR } from '../../common/constants/ai-agent.constant';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserStatus, UserGender } from '@prisma/client';

@Injectable()
export class AiAgentService implements OnModuleInit {
  private readonly logger = new Logger(AiAgentService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(
    private configService: ConfigService,
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.ensureAiUser();

    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GOOGLE_AI_API_KEY not found in configuration');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      tools: [{ functionDeclarations: aiTools }],
    });
  }

  private async ensureAiUser() {
    const aiUser = await this.prisma.user.findUnique({
      where: { id: CHAT_AI_AGENT_ID },
    });

    if (!aiUser) {
      this.logger.log('Creating AI Virtual User...');
      await this.prisma.user.create({
        data: {
          id: CHAT_AI_AGENT_ID,
          fullName: CHAT_AI_AGENT_NAME,
          email: CHAT_AI_AGENT_EMAIL,
          avatarUrl: CHAT_AI_AGENT_AVATAR,
          slug: 'zoka-ai-assistant',
          phone: '0000000000',
          hashedPassword: 'SYSTEM_USER',
          birthday: new Date(),
          gender: UserGender.OTHER,
          status: UserStatus.ACTIVE,
        },
      });
    } else {
      // Update info if changed
      await this.prisma.user.update({
        where: { id: CHAT_AI_AGENT_ID },
        data: {
          fullName: CHAT_AI_AGENT_NAME,
          avatarUrl: CHAT_AI_AGENT_AVATAR,
        },
      });
    }
  }

  async chat(dto: ChatRequestDto) {
    if (!this.model) {
      throw new Error('AI Service not initialized. Check GOOGLE_AI_API_KEY.');
    }

    const history = dto.history || [];
    const chat = this.model.startChat({ history });
    const result = await chat.sendMessage(dto.message);
    const response = result.response;

    let richData: any[] = [];

    const functionCalls = response.functionCalls();
    if (functionCalls) {
      const toolOutputs = await Promise.all(
        functionCalls.map(async (call) => {
          const { name, args } = call;
          this.logger.log(`AI Calling Tool: ${name} with args: ${JSON.stringify(args)}`);
          
          let output;
          switch (name) {
            case 'search_products':
              output = await this.productRepository.listPaginatedForPublic({
                where: {
                  OR: [
                    { name: { contains: (args as any).keywords, mode: 'insensitive' } },
                    { description: { contains: (args as any).keywords, mode: 'insensitive' } },
                  ],
                  status: 'ACTIVE' as any,
                },
                page: 1,
                limit: (args as any).limit || 5,
              });
              break;
            case 'get_product_detail':
              output = await this.productRepository.findPublicDetail({ slug: (args as any).slug });
              break;
            case 'list_categories':
              output = await this.categoryRepository.findRootCategories();
              break;
            default:
              output = { error: 'Tool not found' };
          }

          richData.push({ tool: name, result: output });

          return {
            functionResponse: {
              name,
              response: output,
            },
          };
        }),
      );

      const finalResult = await chat.sendMessage(toolOutputs as any);
      return {
        message: finalResult.response.text(),
        data: richData,
      };
    }

    return {
      message: response.text(),
      data: [],
    };
  }
}
