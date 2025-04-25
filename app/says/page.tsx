"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { motion, AnimatePresence } from "framer-motion"
import TweetCard from "@/components/tweet-card"
import CreateTweet from "@/components/create-tweet"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import type { Tweet, Comment } from "@/types/tweet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import TweetABI from "@/contracts/TweetABI.json"

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x"

export default function TweetsPage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOption, setSortOption] = useState("newest")
  const [filter, setFilter] = useState("all")
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const { toast } = useToast()
  const { address, isConnected, connect, provider } = useWallet()

  // Initialize contract when provider is available
  useEffect(() => {
    const initializeContract = async () => {
      if (provider && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        try {
          const checksumAddress = ethers.getAddress(CONTRACT_ADDRESS);
          const signer = await provider.getSigner();
          const tweetContract = new ethers.Contract(checksumAddress, TweetABI, signer);
          setContract(tweetContract);
        } catch (error) {
          console.error("Error initializing contract:", error);
          toast({
            title: "Contract Error",
            description: "Failed to initialize the contract. Please check your connection.",
            variant: "destructive",
          });
        }
      }
    }

    initializeContract()
  }, [provider, toast])

  // Fetch tweets when contract is ready or filter/sort changes
  useEffect(() => {
    if (isConnected && contract) {
      fetchTweets()
    }
  }, [isConnected, contract, sortOption, filter])

  // Listen for contract events
  useEffect(() => {
    if (contract) {
      const tweetCreatedFilter = contract.filters.TweetCreated()
      const tweetLikedFilter = contract.filters.TweetLiked()
      const tweetDislikedFilter = contract.filters.TweetDisliked()
      const commentAddedFilter = contract.filters.CommentAdded()

      const handleTweetCreated = () => {
        fetchTweets()
      }

      const handleTweetInteraction = () => {
        fetchTweets()
      }

      contract.on(tweetCreatedFilter, handleTweetCreated)
      contract.on(tweetLikedFilter, handleTweetInteraction)
      contract.on(tweetDislikedFilter, handleTweetInteraction)
      contract.on(commentAddedFilter, handleTweetInteraction)

      return () => {
        contract.off(tweetCreatedFilter, handleTweetCreated)
        contract.off(tweetLikedFilter, handleTweetInteraction)
        contract.off(tweetDislikedFilter, handleTweetInteraction)
        contract.off(commentAddedFilter, handleTweetInteraction)
      }
    }
  }, [contract])

  const fetchTweets = async () => {
    try {
      setLoading(true)

      if (!contract) {
        throw new Error("Contract not initialized")
      }

      // Get total tweet count
      const tweetCount = await contract.getTweetCount()

      // For pagination, we'll fetch in batches of 10
      const batchSize = 10
      const offset = 0

      // Get tweets with pagination
      const [ids, authors, contents, timestamps, likes, dislikes] = await contract.getTweets(offset, batchSize)

      // Create tweet objects from the returned data
      const fetchedTweets: Tweet[] = []

      for (let i = 0; i < ids.length; i++) {
        const tweetId = ids[i].toString()

        // Get comments for this tweet
        const commentIds = await contract.getTweetComments(tweetId)
        const comments: Comment[] = []

        // Fetch each comment
        for (let j = 0; j < commentIds.length; j++) {
          const commentId = commentIds[j].toString()
          const [id, commentAuthor, content, commentTimestamp] = await contract.getComment(commentId)

          comments.push({
            id: id.toString(),
            content,
            author: commentAuthor,
            timestamp: Number(commentTimestamp) * 1000, // Convert to milliseconds
          })
        }

        fetchedTweets.push({
          id: tweetId,
          content: contents[i],
          author: authors[i],
          timestamp: Number(timestamps[i]) * 1000, // Convert to milliseconds
          likes: Number(likes[i]),
          dislikes: Number(dislikes[i]),
          comments,
        })
      }

      // Apply filtering
      let filteredTweets = [...fetchedTweets]
      const now = new Date()

      if (filter === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        filteredTweets = filteredTweets.filter((tweet) => tweet.timestamp >= startOfDay)
      } else if (filter === "week") {
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime()
        filteredTweets = filteredTweets.filter((tweet) => tweet.timestamp >= startOfWeek)
      } else if (filter === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
        filteredTweets = filteredTweets.filter((tweet) => tweet.timestamp >= startOfMonth)
      }

      // Apply sorting
      if (sortOption === "newest") {
        filteredTweets.sort((a, b) => b.timestamp - a.timestamp)
      } else if (sortOption === "oldest") {
        filteredTweets.sort((a, b) => a.timestamp - b.timestamp)
      } else if (sortOption === "mostLiked") {
        filteredTweets.sort((a, b) => b.likes - a.likes)
      }

      setTweets(filteredTweets)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching tweets:", error)

      // If contract is not deployed yet, show mock data for demo purposes
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        const mockTweets: Tweet[] = [
          {
            id: "1",
            content: "Just deployed my first smart contract! #blockchain #ethereum",
            author: address || "0x1234...5678",
            timestamp: new Date(Date.now() - 1000 * 60 * 60).getTime(),
            likes: 5,
            dislikes: 1,
            comments: [
              { id: "1", content: "Congrats!", author: "0xabcd...efgh", timestamp: Date.now() - 1000 * 60 * 30 },
            ],
          },
          {
            id: "2",
            content: "Web3 is the future of the internet. Decentralization will change everything.",
            author: "0x8765...4321",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).getTime(),
            likes: 10,
            dislikes: 2,
            comments: [],
          },
          {
            id: "3",
            content: "Learning Solidity has been a great experience so far. Any resources you'd recommend?",
            author: address || "0x1234...5678",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).getTime(),
            likes: 8,
            dislikes: 0,
            comments: [
              {
                id: "2",
                content: "Check out CryptoZombies!",
                author: "0x9876...5432",
                timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
              },
            ],
          },
        ]

        setTweets(mockTweets)
        setLoading(false)

        toast({
          title: "Demo Mode",
          description: "Using mock data. Deploy the contract to see real blockchain data.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch tweets. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
  }

  const handleCreateTweet = async (content: string) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized")
      }

      // Show loading toast
      toast({
        title: "Posting Tweet",
        description: "Please confirm the transaction in your wallet...",
      })

      // Call the contract method
      const tx = await contract.createTweet(content)

      // Wait for transaction to be mined
      await tx.wait()

      // Show success toast
      toast({
        title: "Success",
        description: "Your tweet has been posted to the blockchain!",
      })

      // Refresh tweets
      fetchTweets()
    } catch (error) {
      console.error("Error creating tweet:", error)

      // If contract is not deployed yet, add to local state for demo
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        const newTweet: Tweet = {
          id: (tweets.length + 1).toString(),
          content,
          author: address || "0x0000",
          timestamp: Date.now(),
          likes: 0,
          dislikes: 0,
          comments: [],
        }

        setTweets([newTweet, ...tweets])

        toast({
          title: "Demo Mode",
          description: "Tweet added locally. Deploy the contract for blockchain functionality.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create tweet. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleLike = async (id: string) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized")
      }

      // Call the contract method
      const tx = await contract.likeTweet(id)

      // Wait for transaction to be mined
      await tx.wait()

      // Show success toast
      toast({
        title: "Success",
        description: "You liked the tweet!",
      })

      // Update UI optimistically
      setTweets(tweets.map((tweet) => (tweet.id === id ? { ...tweet, likes: tweet.likes + 1 } : tweet)))
    } catch (error) {
      console.error("Error liking tweet:", error)

      // If contract is not deployed yet, update local state for demo
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        setTweets(tweets.map((tweet) => (tweet.id === id ? { ...tweet, likes: tweet.likes + 1 } : tweet)))
      } else {
        toast({
          title: "Error",
          description: "Failed to like tweet. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDislike = async (id: string) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized")
      }

      // Call the contract method
      const tx = await contract.dislikeTweet(id)

      // Wait for transaction to be mined
      await tx.wait()

      // Show success toast
      toast({
        title: "Success",
        description: "You disliked the tweet!",
      })

      // Update UI optimistically
      setTweets(tweets.map((tweet) => (tweet.id === id ? { ...tweet, dislikes: tweet.dislikes + 1 } : tweet)))
    } catch (error) {
      console.error("Error disliking tweet:", error)

      // If contract is not deployed yet, update local state for demo
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        setTweets(tweets.map((tweet) => (tweet.id === id ? { ...tweet, dislikes: tweet.dislikes + 1 } : tweet)))
      } else {
        toast({
          title: "Error",
          description: "Failed to dislike tweet. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleAddComment = async (tweetId: string, content: string) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized")
      }

      // Show loading toast
      toast({
        title: "Posting Comment",
        description: "Please confirm the transaction in your wallet...",
      })

      // Call the contract method
      const tx = await contract.addComment(tweetId, content)

      // Wait for transaction to be mined
      await tx.wait()

      // Show success toast
      toast({
        title: "Success",
        description: "Your comment has been posted!",
      })

      // Refresh tweets to get the updated comment
      fetchTweets()
    } catch (error) {
      console.error("Error adding comment:", error)

      // If contract is not deployed yet, update local state for demo
      if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        const newComment = {
          id: Math.random().toString(),
          content,
          author: address || "0x0000",
          timestamp: Date.now(),
        }

        setTweets(
          tweets.map((tweet) =>
            tweet.id === tweetId ? { ...tweet, comments: [...tweet.comments, newComment] } : tweet,
          ),
        )

        toast({
          title: "Demo Mode",
          description: "Comment added locally. Deploy the contract for blockchain functionality.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  if (!isConnected) {
    return (
      <motion.div
        className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Connect Your Wallet to View Tweets</h1>
        <Button
          onClick={connect}
          className="bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500 hover:from-green-600 hover:via-yellow-600 hover:to-purple-600"
        >
          Connect Wallet
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500">
          Says
        </h1>

        <CreateTweet onCreateTweet={handleCreateTweet} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 mb-6">
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setFilter}>
            <TabsList className="bg-gradient-to-r from-green-500/10 via-yellow-500/10 to-purple-500/10 dark:from-green-500/20 dark:via-yellow-500/20 dark:to-purple-500/20">
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="mostLiked">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-yellow-500 to-purple-500" />
          </div>
        ) : tweets.length > 0 ? (
          <AnimatePresence>
            <div className="grid gap-6">
              {tweets.map((tweet, index) => (
                <motion.div
                  key={tweet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TweetCard
                    tweet={tweet}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onAddComment={handleAddComment}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No tweets found. Be the first to post something!
          </div>
        )}
      </motion.div>
    </div>
  )
}
