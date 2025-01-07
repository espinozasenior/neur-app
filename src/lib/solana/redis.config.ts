import { RedisStorageClient } from './rinbot-sui-sdk';
import { createClient } from 'redis';

let redisClient: RedisStorageClient | undefined = undefined;

export const getRedisClient = async (): Promise<{ redisClient: RedisStorageClient }> => {
  let kvUrl;

  if (process.env.NODE_ENV === 'development') {
    kvUrl = process.env.KV_DEV_URL;
  } else kvUrl = process.env.KV_URL;

  if (!kvUrl) {
    throw new Error('Empty REDIS_URL');
  }

  if (redisClient && redisClient.isOpen) {
    return { redisClient };
  }

  console.time('[getRedisClient] init');
  redisClient = createClient({
    url: kvUrl,
    socket: { tls: true },
  });

  redisClient.on('error', (error) => {
    console.error('[Redis Client] error event occured:', error);
  });

  await redisClient.connect();
  console.timeEnd('[getRedisClient] init');

  return { redisClient };
};
