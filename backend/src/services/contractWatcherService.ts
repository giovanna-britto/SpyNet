import { findAgentById } from "../repositories/agentReposity";
import { getUserById } from "../repositories/userRepository";
import { io } from '../socket';
import { transferTokens } from "./agentPaymentService";
import prisma from "../config/db";

export const handleContractDepletion = async (contractId: string) => {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      Agent: {
        include: {
          creator: true,
        },
      },
      user: true,
    },
  });

  if (!contract) throw new Error("Contrato não encontrado.");
  if (contract.callsRemaining !== 0) return;

  const payerWalletAddress = contract.user.walletAddress;
  const recipientWalletAddress = contract.Agent.creator.walletAddress;

  if (!payerWalletAddress || !recipientWalletAddress) throw new Error("Carteiras inválidas.");

  // Aqui assumimos um valor fixo por call, você pode somar tudo
  const amount = contract.callsPurchased * contract.Agent.pricePerCall * 1e9; // 1 SOL = 10^9 lamports

    if (contract.callsRemaining === 0) {
    io.to(`user-${contract.userId}`).emit("triggerPayment", {
        from: contract.user.walletAddress,
        to: contract.Agent.creator.walletAddress,
        amountLamports: contract.callsPurchased * contract.Agent.pricePerCall * 1e9,
        contractId: contract.id,
    });
    }

};
