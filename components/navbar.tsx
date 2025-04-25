"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useWallet } from "@/hooks/use-wallet"
import { motion } from "framer-motion"
import { LogOut, Wallet } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { address, isConnected, connect, disconnect } = useWallet()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b ${
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-background"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 flex items-center justify-center text-white font-bold"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            SS
          </motion.div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500">
            saysome
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/says">
            <Button variant="ghost">Says</Button>
          </Link>

          <ModeToggle />

          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden sm:flex">
                  <span className="truncate max-w-[100px]">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-2 border-green-200 dark:border-green-900"
              >
                <DropdownMenuItem onClick={() => disconnect()}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2 text-red-500" />
                    Disconnect
                  </motion.div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={connect}
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 hover:from-green-600 hover:via-yellow-600 hover:to-purple-600"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}
