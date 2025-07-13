import prisma from '../config/db';

export const updateWalletAddress = async (userId: number, walletAddress: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { walletAddress },
  });
};
