import { Request, Response } from 'express';
import { updateWalletAddress } from '../services/userService';

export const setWalletAddress = async (req: Request, res: Response) => {
  const userId = req.user?.user_id; 
  const { walletAddress } = req.body;

  if (!userId || !walletAddress) {
    res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const updatedUser = await updateWalletAddress(userId, walletAddress);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("[Erro setWalletAddress]", err);
    res.status(500).json({ error: "Erro interno" });
  }
};
