import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis.js";

export const monitorQueue = new Queue("monitors", { connection: redisConnection });