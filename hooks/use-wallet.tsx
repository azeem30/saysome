"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any
  }
}

interface WalletContextType {
  address: string | null
  isConnected: boolean
  provider: ethers.BrowserProvider | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await ethersProvider.listAccounts()

          if (accounts.length > 0) {
            setAddress(accounts[0].address)
            setIsConnected(true)
            setProvider(ethersProvider)
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error)
        }
      }
    }

    checkConnection()

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          const ethersProvider = new ethers.BrowserProvider(window.ethereum)
          setProvider(ethersProvider)
        } else {
          setAddress(null)
          setIsConnected(false)
          setProvider(null)
        }
      })

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [])

  const connect = async () => {
    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Handle mobile connection
      try {
        // Check if MetaMask is installed (mobile browsers don't show extensions)
        if (window.ethereum && window.ethereum.isMetaMask) {
          // Regular connection flow for MetaMask mobile browser
          const ethersProvider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await ethersProvider.send("eth_requestAccounts", [])
          
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            setProvider(ethersProvider)
            toast({
              title: "Wallet Connected",
              description: "Your wallet has been connected successfully!",
            })
          }
        } else {
          // Deep link to MetaMask app
          const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + window.location.host
          window.location.href = metamaskAppDeepLink
          
          // Fallback to WalletConnect or regular website if the app isn't installed
          setTimeout(() => {
            if (!window.ethereum) {
              toast({
                title: "MetaMask Not Found",
                description: "Please install MetaMask to use this application.",
                variant: "destructive",
              })
            }
          }, 2000)
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        toast({
          title: "Connection Failed",
          description: "Failed to connect to your wallet. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      // Desktop browser flow
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum)
          const accounts = await ethersProvider.send("eth_requestAccounts", [])

          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            setProvider(ethersProvider)

            toast({
              title: "Wallet Connected",
              description: "Your wallet has been connected successfully!",
            })
          }
        } catch (error) {
          console.error("Failed to connect wallet:", error)
          toast({
            title: "Connection Failed",
            description: "Failed to connect to your wallet. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to use this application.",
          variant: "destructive",
        })
      }
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    setProvider(null)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, provider, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)