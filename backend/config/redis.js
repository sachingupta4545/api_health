// BullMQ connection config — BullMQ manages the ioredis client internally
// Import `redisConnection` wherever you create a Queue or Worker
export const redisConnection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
};
