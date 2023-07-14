import { PrismaClient } from '@prisma/client';
import { getConfig } from '../config';
interface CustomNodeJSGlobal extends Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJSGlobal;

const prisma = global.prisma || new PrismaClient();

if (getConfig().env === 'development') global.prisma = prisma;

export default prisma;
