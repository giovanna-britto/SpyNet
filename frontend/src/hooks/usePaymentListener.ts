import { useEffect } from "react";
import { io } from "socket.io-client";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner";

export const usePaymentListener = (userId?: number) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!userId) return;
    const socket = io("http://localhost:3001");
    socket.emit("join", userId);

    socket.on("triggerPayment", async (data) => {
      if (!publicKey || publicKey.toBase58() !== data.from) {
        console.warn("Wallet não conectada ou não pertence ao usuário.");
        return;
      }

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(data.to),
          lamports: data.amountLamports,
        })
      );

      try {
        const signature = await sendTransaction(tx, connection);
        console.log("✅ Pagamento enviado:", signature);
        toast.success("Pagamento enviado com sucesso!", {
          description: `Assinatura: ${signature}`,
        });
        // Opcional: notificar backend da assinatura
      } catch (err) {
        console.error("❌ Erro no envio do pagamento:", err);
        toast.error("Erro ao enviar pagamento.", {
          description: err instanceof Error ? err.message : String(err),
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, publicKey, connection, sendTransaction]);
};
