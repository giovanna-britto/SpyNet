"use client";

import { useEffect, useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@civic/auth-web3/react";
import StatCard from "./StatCard";
import { Loader2 } from "lucide-react";
// import { ConnectWalletButton } from "@/components/features/wallet/ConnectWalletButton";

const useConnection = () => {
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const con = new Connection(clusterApiUrl("devnet"));
    setConnection(con);
  }, []);

  return { connection };
};

const useSolanaBalance = () => {
  const [balance, setBalance] = useState<number | undefined>();
  const { connection } = useConnection();
  const { address } = useWallet({ type: "solana" });
  const publicKey = address ? new PublicKey(address) : null;

  useEffect(() => {
    if (!connection || !publicKey) return;

    let isMounted = true;

    const fetchBalance = async () => {
      const bal = await connection.getBalance(publicKey);
      if (isMounted) setBalance(bal);
    };

    fetchBalance(); // Busca inicial

    const interval = setInterval(fetchBalance, 5000); // Atualiza a cada 5s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [connection, publicKey]);

  return balance;
};

export function BalanceStatCard() {
  const { address } = useWallet({ type: "solana" });
  const balance = useSolanaBalance();
  const isConnected = !!address;
  const isBalanceLoading = isConnected && balance === undefined;

  const renderContent = () => {
    if (isConnected && isBalanceLoading) {
      return (
        <div className="flex items-center text-neutral-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Fetching balance...</span>
        </div>
      );
    }
    if (isConnected && balance !== undefined) {
      return (
        <div>
          <p className="text-4xl font-bold text-white">
            {(balance / 1e9).toFixed(6)}
            <span className="text-2xl text-neutral-400 ml-2">SOL</span>
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <p className="text-neutral-400">Connect your wallet to see your balance.</p>
        {/* <ConnectWalletButton /> */}
      </div>
    );
  };

  return <StatCard title="Available Balance">{renderContent()}</StatCard>;
}