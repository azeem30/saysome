"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react"
import type { Tweet } from "@/types/tweet"

interface TweetCardProps {
  tweet: Tweet
  onLike: (id: string) => void
  onDislike: (id: string) => void
  onAddComment: (tweetId: string, content: string) => void
}

export default function TweetCard({ tweet, onLike, onDislike, onAddComment }: TweetCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      onAddComment(tweet.id, commentText)
      setCommentText("")
    }
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="tweet-card-container">
      <Card className="overflow-hidden border-2 hover:shadow-md transition-shadow duration-300 card-border-colorful">
        <CardHeader className="flex flex-row items-center gap-3 p-4">
          <Avatar>
            <AvatarFallback
              className={`text-white ${
                Number.parseInt(tweet.id) % 4 === 0
                  ? "bg-gradient-to-r from-green-500 to-yellow-500"
                  : Number.parseInt(tweet.id) % 4 === 1
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : Number.parseInt(tweet.id) % 4 === 2
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-teal-500"
              }`}
            >
              {tweet.author.slice(2, 4).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">
              {tweet.author.slice(0, 6)}...{tweet.author.slice(-4)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(tweet.timestamp), { addSuffix: true })}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-base">{tweet.content}</p>
        </CardContent>
        <CardFooter className="flex flex-col p-4 pt-0 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              onClick={() => onLike(tweet.id)}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{tweet.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
              onClick={() => onDislike(tweet.id)}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{tweet.dislikes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{tweet.comments.length}</span>
            </Button>
          </div>

          <AnimatePresence>
            {showComments && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-t pt-3 space-y-3">
                  {tweet.comments.length > 0 ? (
                    tweet.comments.map((comment, index) => (
                      <div key={comment.id} className="flex gap-2 items-start">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            className={`text-xs text-white ${
                              index % 4 === 0
                                ? "bg-gradient-to-r from-green-500 to-yellow-500"
                                : index % 4 === 1
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                  : index % 4 === 2
                                    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                                    : "bg-gradient-to-r from-blue-500 to-teal-500"
                            }`}
                          >
                            {comment.author.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-muted p-2 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs font-medium">
                              {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">No comments yet</p>
                  )}

                  <form onSubmit={handleSubmitComment} className="flex gap-2 mt-3">
                    <Input
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!commentText.trim()}
                      className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
