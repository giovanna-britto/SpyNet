"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HiredAgent } from "@/types";

// --- NOVO COMPONENTE: Modal de Instruções de Uso ---
interface AgentUsageModalProps {
  agent: HiredAgent;
  onClose: () => void;
}

const AgentUsageModal = ({ agent, onClose }: AgentUsageModalProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const endpointUrl = "http://localhost:3001/proxy/call";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2s
  };

  return (
    // Fundo semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      {/* Container do Modal */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl w-full max-w-2xl p-8 space-y-6 relative animate-in fade-in-0 zoom-in-95">
        {/* Botão de Fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        {/* Cabeçalho */}
        <div>
          <h2 className="text-2xl font-bold text-white">How to Use: {agent.agentName}</h2>
          <p className="text-neutral-400">Follow these instructions to call the agent's API.</p>
        </div>

        {/* Corpo com as Instruções */}
        <div className="space-y-4">
          {/* Endpoint */}
          <div>
            <label className="text-sm font-medium text-neutral-400">Endpoint URL (POST)</label>
            <div className="mt-1 bg-neutral-800 p-3 rounded-lg font-mono text-sm text-green-400">
              {endpointUrl}
            </div>
          </div>

          {/* Header */}
          <div>
            <label className="text-sm font-medium text-neutral-400">HTTP Header</label>
            <div className="mt-1 bg-neutral-800 p-3 rounded-lg font-mono text-sm">
              <span className="text-cyan-400">x-api-key</span>: <span className="text-neutral-300">YOUR_API_KEY</span>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="text-sm font-medium text-neutral-400">Your API Key</label>
            <div className="mt-1 flex items-center justify-between bg-neutral-800 p-3 rounded-lg">
              <span className="font-mono text-sm text-yellow-400 truncate pr-4">
                {agent.apiKey}
              </span>
              <button
                onClick={() => copyToClipboard(agent.apiKey)}
                className="p-2 rounded-md hover:bg-neutral-700 transition-colors flex items-center text-sm"
              >
                {isCopied ? <Check size={16} className="text-green-400 mr-2" /> : <Copy size={16} className="mr-2" />}
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-neutral-800 pt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose} className="bg-primary hover:bg-primary/90 rounded-md">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL (MODIFICADO) ---
interface HiredAgentListProps {
  contracts: HiredAgent[];
}

export default function HiredAgentList({ contracts }: HiredAgentListProps) {
  // Estado para controlar qual agente está selecionado para o modal
  const [selectedAgent, setSelectedAgent] = useState<HiredAgent | null>(null);

  if (contracts.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-lg">
        <p className="text-neutral-400">You haven't hired any agents yet.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {/* Cabeçalho da Tabela */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 text-neutral-400 text-sm font-semibold">
          <div className="col-span-2">Name</div>
          <div>Costs</div>
          <div>Queries</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Lista de Cards */}
        <div className="space-y-4">
          {contracts.map(contract => (
            <div key={contract.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-white">
              <div className="col-span-2 font-medium flex flex-col">
                <span>{contract.agentName}</span>
                <span className="text-xs text-neutral-400">by {contract.creatorName}</span>
              </div>
              <div className="md:text-left"><span className="md:hidden font-semibold">Costs: </span>${contract.cost}</div>
              <div className="md:text-left"><span className="md:hidden font-semibold">Queries: </span>{contract.queries}</div>
              <div className="col-span-1 flex justify-end gap-2">
                {/* Botão modificado para abrir o modal */}
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-primary hover:bg-primary/90 rounded-md" 
                  onClick={() => setSelectedAgent(contract)}
                >
                  Access Agent
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Renderiza o modal se um agente estiver selecionado */}
      {selectedAgent && (
        <AgentUsageModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </>
  );
}
