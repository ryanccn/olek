import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	// eslint-disable-next-line no-var
	var __devPrismaClient: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = globalThis.__devPrismaClient ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production')
	globalThis.__devPrismaClient = prisma;
