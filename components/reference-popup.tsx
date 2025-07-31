"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Calendar, User, FileText, ExternalLink, Copy, CheckCircle } from "lucide-react"

interface Reference {
  id: string
  title: string
  type: "message" | "file" | "meeting"
  source: string
  timestamp: string
  author?: string
  excerpt: string
}

interface DetailedReference extends Reference {
  fullContent: string
  metadata: {
    channel?: string
    team?: string
    messageId?: string
    fileSize?: string
    fileType?: string
    participants?: string[]
    meetingDuration?: string
    url?: string
  }
  context: {
    previousMessage?: string
    nextMessage?: string
    threadContext?: string
  }
}

interface ReferencePopupProps {
  reference: Reference | null
  isOpen: boolean
  onClose: () => void
}

export function ReferencePopup({ reference, isOpen, onClose }: ReferencePopupProps) {
  const [detailedReference, setDetailedReference] = useState<DetailedReference | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (reference && isOpen) {
      fetchDetailedReference(reference.id)
    }
  }, [reference, isOpen])

  const fetchDetailedReference = async (referenceId: string) => {
    setIsLoading(true)
    try {
      // Get token from localStorage
      const token = localStorage.getItem("nexus_token")
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_CHAT_REFERENCE_ENDPOINT?.replace("{id}", referenceId)}`,
        {
          headers: {
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        setDetailedReference(data.reference)
      }
    } catch (error) {
      console.error("Failed to fetch reference details:", error)
      // Fallback to mock data for demo
      setDetailedReference({
        ...reference!,
        fullContent: `This is the full content of the reference from ${reference!.source}. It contains detailed information about the topic discussed, including specific data points, decisions made, and action items identified during the conversation.

The discussion covered multiple aspects:
1. Technical implementation details
2. Timeline and milestones
3. Resource allocation
4. Risk assessment and mitigation strategies

Key participants shared their insights and the team reached consensus on the proposed approach.`,
        metadata: {
          channel: reference!.source,
          team: "Product Development",
          messageId: "msg_" + referenceId,
          participants: ["Sarah Johnson", "Mike Chen", "Alex Wilson"],
          url: `https://teams.microsoft.com/l/message/${referenceId}`,
        },
        context: {
          previousMessage: "Previous context about the discussion topic...",
          nextMessage: "Follow-up message with additional details...",
          threadContext: "This message was part of a larger thread about Q4 planning",
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyContent = async () => {
    if (detailedReference) {
      await navigator.clipboard.writeText(detailedReference.fullContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4" />
      case "file":
        return <FileText className="w-4 h-4" />
      case "meeting":
        return <Calendar className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "message":
        return "bg-blue-100 text-blue-800"
      case "file":
        return "bg-green-100 text-green-800"
      case "meeting":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!reference) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getTypeIcon(reference.type)}
            <span>Reference Details</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : detailedReference ? (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{detailedReference.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <Badge className={getTypeColor(detailedReference.type)}>
                    {getTypeIcon(detailedReference.type)}
                    <span className="ml-1 capitalize">{detailedReference.type}</span>
                  </Badge>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {detailedReference.timestamp}
                  </span>
                  {detailedReference.author && (
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {detailedReference.author}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyContent}
                  className="flex items-center bg-transparent"
                >
                  {copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                {detailedReference.metadata.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(detailedReference.metadata.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open in Teams
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Content */}
            <div>
              <h4 className="font-semibold mb-3">Full Content</h4>
              <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-slate-50">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{detailedReference.fullContent}</div>
              </ScrollArea>
            </div>

            {/* Metadata */}
            <div>
              <h4 className="font-semibold mb-3">Metadata</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {detailedReference.metadata.team && (
                  <div>
                    <span className="font-medium text-slate-600">Team:</span>
                    <p>{detailedReference.metadata.team}</p>
                  </div>
                )}
                {detailedReference.metadata.channel && (
                  <div>
                    <span className="font-medium text-slate-600">Channel:</span>
                    <p>{detailedReference.metadata.channel}</p>
                  </div>
                )}
                {detailedReference.metadata.participants && (
                  <div>
                    <span className="font-medium text-slate-600">Participants:</span>
                    <p>{detailedReference.metadata.participants.join(", ")}</p>
                  </div>
                )}
                {detailedReference.metadata.fileSize && (
                  <div>
                    <span className="font-medium text-slate-600">File Size:</span>
                    <p>{detailedReference.metadata.fileSize}</p>
                  </div>
                )}
                {detailedReference.metadata.messageId && (
                  <div>
                    <span className="font-medium text-slate-600">Message ID:</span>
                    <p className="font-mono text-xs">{detailedReference.metadata.messageId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Context */}
            {detailedReference.context.threadContext && (
              <div>
                <h4 className="font-semibold mb-3">Context</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                    <p className="text-sm text-blue-800">{detailedReference.context.threadContext}</p>
                  </div>
                  {detailedReference.context.previousMessage && (
                    <div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Previous Message
                      </span>
                      <p className="text-sm text-slate-600 mt-1">{detailedReference.context.previousMessage}</p>
                    </div>
                  )}
                  {detailedReference.context.nextMessage && (
                    <div>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Next Message</span>
                      <p className="text-sm text-slate-600 mt-1">{detailedReference.context.nextMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600">Failed to load reference details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
