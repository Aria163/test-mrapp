import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Create Prisma client instance with logging configuration
const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown handler
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

export default prisma;
