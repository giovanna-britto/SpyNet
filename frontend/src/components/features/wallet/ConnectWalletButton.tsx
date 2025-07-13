"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,      
  DialogTitle,       
  DialogDescription, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { WalletConnectModal } from "./WalletConnectModal";
import { useAccount, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";

export function ConnectWalletButton() {
  // Garantia de que o componente só renderiza no cliente
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Não renderiza nada até o componente estar "montado" no cliente
  if (!isClient) {
    return null;
  }

  if (isConnected) {
    return (
        <div className="flex items-center gap-3 rounded-full border border-primary/80 px-4 py-2 text-sm">
            <span className="font-medium text-white">{formatAddress(address)}</span>
            <div className="h-4 w-px bg-white/30" />
            <button
                onClick={() => disconnect()}
                className="font-medium text-white/70 hover:text-white transition-colors"
            >
                Sair
            </button>
        </div>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary hover:bg-primary/90">Conectar Carteira</Button>
      </DialogTrigger>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-md">
        <DialogHeader className="sr-only"> 
          <DialogTitle>Conecte Sua Carteira</DialogTitle>
          <DialogDescription>
            Escolha uma das opções de carteira abaixo para conectar ao nosso serviço.
          </DialogDescription>
        </DialogHeader>
        <WalletConnectModal onConnectSuccess={() => setIsModalOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}