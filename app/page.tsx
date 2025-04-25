"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, MessageSquare, ThumbsDown, ThumbsUp, Check, Wallet, PlusCircle, Wifi, Zap, Link2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import saysome from "@/assets/saysome.svg"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  Say Something. Say Anything. saysome.
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  A decentralized platform where your thoughts are truly yours, secured on the blockchain forever.
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col gap-2 min-[400px]:flex-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <Link href="/says">
                  <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600">
                    Say and Slay !
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px]">
                <Image
                  src={saysome}
                  alt="saysome app preview"
                  className="rounded-lg object-cover"
                  fill
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        className="py-12 md:py-24 bg-gradient-to-br from-green-50 via-yellow-50 to-purple-50 dark:from-green-950/20 dark:via-yellow-950/10 dark:to-purple-950/20 rounded-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500">
                Features
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover what makes saysome different from traditional social media
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <motion.div
              className="grid gap-1 p-6 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThumbsUp className="h-10 w-10 text-green-500" />
              <h3 className="text-xl font-bold">Decentralized</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your tweets are stored on the blockchain, not on centralized servers.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-1 p-6 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MessageSquare className="h-10 w-10 text-yellow-500" />
              <h3 className="text-xl font-bold">Censorship Resistant</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No one can delete or modify your tweets once they're on the blockchain.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-1 p-6 rounded-xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThumbsDown className="h-10 w-10 text-purple-500" />
              <h3 className="text-xl font-bold">Own Your Data</h3>
              <p className="text-gray-500 dark:text-gray-400">Your content belongs to you, not to a corporation.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* New "How to use saysome?" section */}
      <motion.section
        className="py-12 md:py-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500">
                How to use saysome?
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Get started in just a few simple steps
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl items-start gap-8 py-12 lg:grid-cols-1">
            <motion.div 
              className="grid gap-6 p-6 rounded-xl bg-gradient-to-br from-green-50 to-purple-50 dark:from-green-950/20 dark:to-purple-950/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Step 1: Add MetaMask extension to your browser</h3>
                </div>
                <p className="ml-14 text-gray-500 dark:text-gray-400">
                  Install the MetaMask wallet extension from the Chrome Web Store or Firefox Add-ons.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                    <PlusCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold">Step 2: Create a wallet on MetaMask</h3>
                </div>
                <p className="ml-14 text-gray-500 dark:text-gray-400">
                  Follow the setup process to create a new Ethereum wallet. Remember to securely store your seed phrase.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                    <Wifi className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Step 3: Change the network to Sepolia Test Network</h3>
                </div>
                <p className="ml-14 text-gray-500 dark:text-gray-400">
                  In MetaMask, switch from Ethereum Mainnet to the Sepolia Test Network in the network dropdown.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Step 4: Add Test Ethers using Sepolia Faucet</h3>
                </div>
                <p className="ml-14 text-gray-500 dark:text-gray-400">
                  Use a Sepolia faucet to get test ETH for transactions. You'll need this to post on the blockchain.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                    <Link2 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold">Step 5: Connect your Wallet to saysome</h3>
                </div>
                <p className="ml-14 text-gray-500 dark:text-gray-400">
                  Click the "Connect Wallet" button on saysome and approve the connection in MetaMask.
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Step 6: Start saying!</h3>
                </div>
                <p className="ml-14 text-gray-500 dark:text-gray-400">
                  You're all set! Post your thoughts to the blockchain and interact with others.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}