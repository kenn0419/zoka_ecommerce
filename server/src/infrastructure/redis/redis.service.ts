import {
  Global,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Global()
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  private client: RedisClientType;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const host = this.config.get('REDIS_HOST') || '127.0.0.1';
    const port = this.config.get('REDIS_PORT') || '6379';
    const password = this.config.get('REDIS_PASSWORD');
    const url = password
      ? `redis://:${password}@${host}:${port}`
      : `redis://${host}:${port}`;

    this.client = createClient({ url });

    this.client.on('error', (err) => {
      this.logger.error(`Redis client error: ${err.message}`, err.stack);
    });

    await this.client.connect();

    this.logger.log('Redis connected (cache + socket pub/sub)');
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async sadd(key: string, value: string) {
    await this.client.sAdd(key, value);
  }

  async smembers(key: string) {
    return await this.client.sMembers(key);
  }

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cachedData = await this.client.get(key);
    if (cachedData) {
      try {
        return JSON.parse(cachedData) as T;
      } catch (e) {
        this.logger.error(`Error parsing cached data for key ${key}`, e);
      }
    }

    const data = await fetchFn();

    if (data !== undefined && data !== null) {
      try {
        const stringified = JSON.stringify(data);
        if (ttl) {
          await this.client.set(key, stringified, { EX: ttl });
        } else {
          await this.client.set(key, stringified);
        }
      } catch (e) {
        this.logger.error(`Error stringifying data for cache key ${key}`, e);
      }
    }

    return data;
  }

  async delByPattern(pattern: string) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        this.logger.debug(
          `Deleted ${keys.length} keys matching pattern: ${pattern}`,
        );
      }
    } catch (e) {
      this.logger.error(`Error deleting keys by pattern ${pattern}`, e);
    }
  }

  get cacheClient() {
    return this.client;
  }

  async onModuleDestroy() {
    this.client.quit();
  }
}
