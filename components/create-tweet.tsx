"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface CreateTweetProps {
  onCreateTweet: (content: string) => void
}

export default function CreateTweet({ onCreateTweet }: CreateTweetProps) {
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const { address } = useWallet()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onCreateTweet(content)
      setContent("")
      setIsExpanded(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 card-border-colorful overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 pb-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
                {address ? address.slice(2, 4).toUpperCase() : "Me"}
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg min-h-[60px]"
                  rows={isExpanded ? 4 : 2}
                />

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: isExpanded ? 1 : 0,
                    height: isExpanded ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="text-xs text-muted-foreground">Add hashtags with #</span>
                    </div>
                    <div
                      className={`text-sm font-medium ${content.length > 250 ? "text-yellow-500" : content.length > 270 ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      {280 - content.length}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              height: isExpanded ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <CardFooter className="flex justify-between items-center pt-0 pb-4 px-4 border-t mt-2">
              <div className="w-full">
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      content.length > 270
                        ? "bg-red-500"
                        : content.length > 250
                          ? "bg-yellow-500"
                          : "bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500"
                    }`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min((content.length / 280) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={!content.trim() || content.length > 280 || !address}
                className="bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 hover:from-green-600 hover:via-yellow-600 hover:to-purple-600 text-white ml-4 px-4 py-2 rounded-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="mr-2 h-4 w-4" />
                Say
              </motion.button>
            </CardFooter>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  )
}
