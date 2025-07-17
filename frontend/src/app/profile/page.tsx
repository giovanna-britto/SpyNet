"use client";

import { useEffect, useState } from "react";
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, UserButton } from "@civic/auth-web3/react";

// Hook para criar e gerenciar a conexão com a rede Solana.
const useConnection = () => {
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const con = new Connection(clusterApiUrl("devnet"), "confirmed");
    setConnection(con);
  }, []);

  return { connection };
};

// Hook para buscar o saldo da carteira conectada.
const useBalance = () => {
  const [balance, setBalance] = useState<number>();
  const { connection } = useConnection();
  const { address } = useWallet({ type: "solana" });

  useEffect(() => {
    if (connection && address) {
      const publicKey = new PublicKey(address);
      connection.getBalance(publicKey).then(setBalance);
    }
  }, [connection, address]);

  return balance;
};

// Ícones em SVG ampliados
const SolanaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-4 text-purple-400">
    <path d="M12 4H6.66a4 4 0 0 0-4 4.66V12h4.66a4 4 0 0 0 4-4.66V4Z"/>
    <path d="M12 20h5.34a4 4 0 0 0 4-4.66V12h-4.66a4 4 0 0 0-4 4.66V20Z"/>
    <path d="M4 12v5.34a4 4 0 0 0 4.66 4H12v-4.66a4 4 0 0 0-4.66-4H4Z"/>
    <path d="M20 12V6.66a4 4 0 0 0-4.66-4H12v4.66a4 4 0 0 0 4.66 4H20Z"/>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Wallet = () => {
  const balance = useBalance();
  const { address } = useWallet({ type: "solana" });
  const [isCopied, setIsCopied] = useState(false);

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 max-w-2xl mx-auto my-16 shadow-2xl text-white font-sans text-lg">
      <div className="flex flex-col space-y-10">
        {/* Cabeçalho do Card */}
        <div>
          <h2 className="text-4xl font-extrabold">Minha Carteira</h2>
          <p className="text-neutral-400 text-xl mt-2">Conectada via Civic na rede Devnet</p>
        </div>

        {/* Botão de Conexão/Desconexão do Civic */}
        <div className="flex justify">
          <div className="scale-125">
            <UserButton />
          </div>
        </div>

        {/* Exibe as informações apenas se a carteira estiver conectada */}
        {address && (
          <div className="space-y-8 border-t border-neutral-800 pt-10">
            {/* Seção do Saldo */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-neutral-400">Saldo Atual</label>
              <div className="bg-neutral-800 p-8 rounded-xl">
                {balance !== undefined ? (
                  <p className="text-5xl font-bold text-white flex items-center">
                    <SolanaIcon />
                    {(balance / LAMPORTS_PER_SOL).toFixed(6)} SOL
                  </p>
                ) : (
                  <div className="animate-pulse h-16 bg-neutral-700 rounded-md w-2/3"></div>
                )}
              </div>
            </div>

            {/* Seção do Endereço */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-neutral-400">Endereço da Carteira</label>
              <div className="flex items-center justify-between bg-neutral-800 p-6 rounded-xl">
                <span className="font-mono text-xl text-neutral-300 truncate">
                  {truncateAddress(address)}
                </span>
                <button 
                  onClick={handleCopy} 
                  className="p-4 rounded-lg hover:bg-neutral-700 transition-colors duration-200"
                  aria-label="Copiar endereço"
                >
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
