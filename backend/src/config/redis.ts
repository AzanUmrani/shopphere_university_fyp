import { createClient, RedisClientType } from "redis";
import logger from "./logger";

let client: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  try {
    const redisOptions: any = {
      url: process.env.REDIS_URL || "redis://localhost:6379",
    };

    if (process.env.REDIS_PASSWORD) {
      redisOptions.password = process.env.REDIS_PASSWORD;
    }

    client = createClient(redisOptions);

    client.on("error", (error) => {
      logger.error("Redis Client Error:", error);
    });

    client.on("connect", () => {
      logger.info("Connected to Redis");
    });

    client.on("ready", () => {
      logger.info("Redis client ready");
    });

    client.on("end", () => {
      logger.info("Redis connection ended");
    });

    await client.connect();
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  if (!client) {
    logger.warn(
      "Redis client not initialized. Some features may not work optimally."
    );
    return null;
  }
  return client;
};

export const disconnectRedis = async (): Promise<void> => {
  if (client) {
    await client.disconnect();
    logger.info("Disconnected from Redis");
  }
};

// Cache utility functions
export const cacheService = {
  // Set a key-value pair with optional expiry
  set: async (
    key: string,
    value: any,
    expiryInSeconds?: number
  ): Promise<void> => {
    try {
      if (!client) {
        logger.warn("Redis client not available, skipping cache set");
        return;
      }
      const serializedValue = JSON.stringify(value);
      if (expiryInSeconds) {
        await client.setEx(key, expiryInSeconds, serializedValue);
      } else {
        await client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error(`Error setting cache for key ${key}:`, error);
      // Don't throw error - gracefully degrade without caching
    }
  },

  // Get a value by key
  get: async <T = any>(key: string): Promise<T | null> => {
    try {
      if (!client) {
        logger.warn("Redis client not available, returning null for cache get");
        return null;
      }
      const value = await client.get(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  },

  // Delete a key
  del: async (key: string): Promise<void> => {
    try {
      if (!client) {
        logger.warn("Redis client not available, skipping cache delete");
        return;
      }
      await client.del(key);
    } catch (error) {
      logger.error(`Error deleting cache for key ${key}:`, error);
      // Don't throw - graceful degradation
    }
  },

  // Check if key exists
  exists: async (key: string): Promise<boolean> => {
    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  },

  // Set expiry for a key
  expire: async (key: string, seconds: number): Promise<void> => {
    try {
      await client.expire(key, seconds);
    } catch (error) {
      logger.error(`Error setting expiry for key ${key}:`, error);
      throw error;
    }
  },

  // Get all keys matching a pattern
  keys: async (pattern: string): Promise<string[]> => {
    try {
      return await client.keys(pattern);
    } catch (error) {
      logger.error(`Error getting keys for pattern ${pattern}:`, error);
      return [];
    }
  },

  // Flush all keys
  flushAll: async (): Promise<void> => {
    try {
      await client.flushAll();
    } catch (error) {
      logger.error("Error flushing all cache:", error);
      throw error;
    }
  },
};

export default cacheService;
