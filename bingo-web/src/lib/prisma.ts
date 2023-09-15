import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// ホットリロードでエラーが出るのを防ぐ
export const prisma = global.prisma || new PrismaClient();
global.prisma = prisma;
