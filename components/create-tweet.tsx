"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface CreateTweetProps {
  onCreateTweet: (content: string) => void
}

export default function CreateTweet({ onCreateTweet }: CreateTweetProps) {
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

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
      <Card className="border-2 card-border-colorful">
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-4">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              rows={isExpanded ? 4 : 2}
            />
          </CardContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isExpanded ? 1 : 0,
              height: isExpanded ? "auto" : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <CardFooter className="flex justify-between items-center pt-0">
              <p className="text-sm text-muted-foreground">{280 - content.length} characters remaining</p>
              <Button
                type="submit"
                disabled={!content.trim() || content.length > 280}
                className="bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 hover:from-green-600 hover:via-yellow-600 hover:to-purple-600 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                Say It !
              </Button>
            </CardFooter>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  )
}
