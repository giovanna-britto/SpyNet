import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import crypto from 'crypto';
import { io } from '../socket';
import { Decimal } from '@prisma/client/runtime/library';
import { Contract, User, Agent } from '@prisma/client';

// A constante LAMORTS_PER_SOL não é mais necessária para o cálculo principal,
// mas pode ser útil para logs ou outras conversões.

interface ContractWithRelations extends Contract {
  User: User;
  Agent: Agent & { creator: User };
}

const sendPaymentNotification = (contract: ContractWithRelations) => {
  const { User: hirer, Agent: agent, callsPurchased } = contract;
  const creator = agent.creator;

  if (!hirer.walletAddress || !creator.walletAddress) {
    console.error(`[ERRO de Notificação] Carteira não definida para o contratante ${hirer.id} ou criador ${creator.id}`);
    return;
  }
  
  // --- LÓGICA DE CÁLCULO CORRIGIDA ---
  // Assumimos que 'agent.pricePerCall' já está em LAMPORTS.
  // Portanto, removemos a multiplicação por LAMORTS_PER_SOL.
  const amountLamports = new Decimal(callsPurchased).times(agent.pricePerCall).floor().toNumber();
  // --- FIM DA CORREÇÃO ---

  // Verificação para garantir que o valor não é zero ou negativo
  if (amountLamports <= 0) {
    console.error(`[ERRO de Notificação] O valor calculado para a transação é inválido: ${amountLamports} lamports.`);
    return;
  }

  const paymentData = {
    from: hirer.walletAddress,
    to: creator.walletAddress,
    amountLamports,
    metadata: {
      agentName: agent.name,
      callsToRecharge: callsPurchased,
    }
  };

  console.log(`[Socket] Créditos esgotados. Enviando 'triggerPayment' para user-${hirer.id} com ${amountLamports} lamports.`);
  io.to(`user-${hirer.id}`).emit('triggerPayment', paymentData);
};

// O resto do arquivo permanece exatamente igual...
export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
      res.status(401).json({ error: 'API key ausente.' });
      return;
    }

    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        contract: {
          include: { User: true, Agent: { include: { creator: true } } },
        },
      },
    });

    if (!keyRecord || !keyRecord.contract || !keyRecord.contract.Agent || !keyRecord.contract.User) {
      res.status(403).json({ error: 'API key inválida ou dados de contrato/usuário incompletos.' });
      return;
    }

    const contract = keyRecord.contract as ContractWithRelations;

    if (contract.callsRemaining === 0) {
      sendPaymentNotification(contract);
      res.status(402).json({ error: 'Créditos esgotados. Renove o contrato.' });
      return;
    }
    
    let updatedContract = contract;

    if (contract.callsRemaining !== -1) {
      updatedContract = await prisma.contract.update({
        where: { id: contract.id },
        data: { callsRemaining: { decrement: 1 } },
        include: { User: true, Agent: { include: { creator: true } } },
      }) as ContractWithRelations;
    }

    if (updatedContract.callsRemaining === 0) {
      sendPaymentNotification(updatedContract);
    }
    
    const hash = crypto.createHash('sha256')
      .update(`${contract.id}-${Date.now()}-${Math.random()}`)
      .digest('hex');

    await prisma.usageLog.create({
      data: {
        contractId: contract.id,
        callsUsed: 1,
        usageHash: hash,
      },
    });

    (req as any).contract = updatedContract;
    (req as any).usageHash = hash;

    next();
  } catch (error: any) {
    console.error('[ERRO apiKeyAuth]', error);
    res.status(500).json({ error: 'Erro interno no middleware de autenticação.', details: error.message });
  }
};