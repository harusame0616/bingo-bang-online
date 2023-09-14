import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// ホットリロードでエラーが出るのを防ぐ
export const prisma = global.prisma || new PrismaClient();
global.prisma = prisma;
