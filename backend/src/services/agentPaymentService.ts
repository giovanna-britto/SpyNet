import { Connection, Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

// RPC público ou seu endpoint customizado
const connection = new Connection("https://api.testnet.solana.com");

export const transferTokens = async (fromWallet: any, toAddress: string, amountLamports: number) => {
  const toPubkey = new PublicKey(toAddress);
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey,
      lamports: amountLamports,
    })
  );

  const signature = await fromWallet.sendTransaction(transaction, connection);
  return signature;
};
