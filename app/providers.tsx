"use client"

import type React from "react"

import { WalletProvider } from "@/hooks/use-wallet"

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}
