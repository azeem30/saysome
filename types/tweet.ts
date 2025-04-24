export interface Comment {
  id: string
  content: string
  author: string
  timestamp: number
}

export interface Tweet {
  id: string
  content: string
  author: string
  timestamp: number
  likes: number
  dislikes: number
  comments: Comment[]
}
