"use client"

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserButton } from "@civic/auth-web3/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => setMobileMenuOpen((open) => !open);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/10 shadow-sm">
      <nav className="container mx-auto h-20 flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/image.png"
            alt="SpyNet Logo"
            className="h-10 w-auto rounded-md shadow"
          />
        
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href={"/marketplace"} className="text-whi hover:text-primary/80">
          Marketplace
          </Link>

          <Link href={"/dashboard"} className="text-whi hover:text-primary/80">
          Dashboard
          </Link>
          <UserButton />
          <WalletMultiButton />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMenuToggle}
            className="text-primary hover:bg-accent"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/10 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <UserButton />
            <WalletMultiButton />
            {/* Adicione links de navegação aqui se desejar */}
          </div>
        </div>
      )}
    </header>
  );
}