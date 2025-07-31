"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Bot, User, MessageSquare, Clock, Database, Sparkles, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { ReferencePopup } from "@/components/reference-popup"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: string
  sources?: string[]
}

interface Conversation {
  id: number
  title: string
  lastMessage: string
  timestamp: string
  messageCount: number
}

export default function ChatPage() {
  const { user, hasPermission } = useAuth()

  // All users can access chat, but we can show different features based on role
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm Nexus, your organization's knowledge assistant. I have access to information from your Microsoft Teams channels and can help answer questions about your company's discussions, documents, and shared knowledge. What would you like to know?",
      timestamp: "10:00 AM",
      sources: [],
    },
  ])

  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      title: "Q4 Planning Discussion",
      lastMessage: "What are the key priorities for Q4?",
      timestamp: "2 hours ago",
      messageCount: 12,
    },
    {
      id: 2,
      title: "Product Launch Timeline",
      lastMessage: "When is the beta release scheduled?",
      timestamp: "Yesterday",
      messageCount: 8,
    },
    {
      id: 3,
      title: "Team Meeting Notes",
      lastMessage: "Can you summarize last week's standup?",
      timestamp: "2 days ago",
      messageCount: 15,
    },
  ])

  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedReference, setSelectedReference] = useState<any>(null)
  const [isReferencePopupOpen, setIsReferencePopupOpen] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = currentMessage
    setCurrentMessage("")
    setIsTyping(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("nexus_token")
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_CHAT_MESSAGE_ENDPOINT}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          },
          body: JSON.stringify({
            message: messageToSend,
            conversation_id: "current_conversation",
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        const botResponse: Message = {
          id: messages.length + 2,
          type: "bot",
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sources: data.sources?.map((s: any) => s.title) || [
            "Marketing Team Channel",
            "Product Development",
            "General",
          ],
        }
        setMessages((prev) => [...prev, botResponse])
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      // Fallback to mock response
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: getBotResponse(messageToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: ["Marketing Team Channel", "Product Development", "General"],
      }
      setMessages((prev) => [...prev, botResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("q4") || lowerMessage.includes("planning")) {
      return "Based on discussions in the Marketing Team and Product Development channels, the key Q4 priorities include: 1) Launching the new product beta by October 15th, 2) Increasing customer acquisition by 25%, and 3) Implementing the new CRM system. The marketing team has allocated additional budget for digital campaigns, and engineering is focusing on performance optimizations."
    }

    if (lowerMessage.includes("meeting") || lowerMessage.includes("standup")) {
      return "From last week's standup notes in the Engineering channel: The team completed 8 story points, resolved 3 critical bugs, and started work on the authentication system. Sarah mentioned the API integration is 80% complete, and Mike flagged potential performance issues that need investigation. Next sprint planning is scheduled for Friday."
    }

    if (lowerMessage.includes("launch") || lowerMessage.includes("beta")) {
      return "According to the Product Development channel, the beta release is scheduled for October 15th. The current status shows: UI/UX design is complete, backend APIs are 85% done, and QA testing begins next week. The team is confident about meeting the deadline, but they've identified database optimization as a potential risk factor."
    }

    return "I found relevant information from your Teams channels. Based on recent discussions, I can provide insights about your team's projects, meetings, and shared documents. Could you be more specific about what you'd like to know?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-bold">Nexus Chat</h1>
          </div>
          <p className="text-sm text-slate-600 mt-1">Your organization's knowledge assistant</p>
        </div>

        <div className="p-4">
          <h2 className="font-semibold mb-3 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Recent Conversations
          </h2>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card key={conv.id} className="cursor-pointer hover:bg-slate-50 transition-colors">
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm mb-1">{conv.title}</h3>
                  <p className="text-xs text-slate-600 mb-2 line-clamp-2">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {conv.timestamp}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {conv.messageCount} msgs
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold">Nexus Assistant</h2>
                <p className="text-sm text-slate-600">Connected to 3 Teams channels</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Online
              </Badge>
              {user && (
                <Badge variant="outline">
                  {user.name} - {user.role.replace("_", " ").toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex space-x-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-blue-600" : "bg-slate-100"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-4 ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-white border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-2">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2 hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                              onClick={() => {
                                setSelectedReference({
                                  id: `ref_${message.id}_${index}`,
                                  title: `Reference from ${source}`,
                                  type: "message",
                                  source: source,
                                  timestamp: message.timestamp,
                                  author: "Team Member",
                                  excerpt: `Information from ${source} channel...`,
                                })
                                setIsReferencePopupOpen(true)
                              }}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {source}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-3 max-w-3xl">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <ReferencePopup
          reference={selectedReference}
          isOpen={isReferencePopupOpen}
          onClose={() => setIsReferencePopupOpen(false)}
        />

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your organization's knowledge..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isTyping} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Nexus can access information from Marketing Team, Engineering, and General channels
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
