"use client"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-2 border-green-200 dark:border-green-900"
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center"
          >
            <Sun className="h-4 w-4 mr-2 text-yellow-500" />
            Light
          </motion.div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center"
          >
            <Moon className="h-4 w-4 mr-2 text-purple-500" />
            Dark
          </motion.div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center"
          >
            <Laptop className="h-4 w-4 mr-2 text-green-500" />
            System
          </motion.div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
