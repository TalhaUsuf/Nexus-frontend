"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function OAuthPage() {
  const [step, setStep] = useState(1)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate OAuth flow
    setTimeout(() => {
      setStep(2)
      setIsConnecting(false)
    }, 2000)
  }

  const handleComplete = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Connect Your Organization</h1>
            <p className="text-slate-600">Securely connect your Microsoft Teams organization to Nexus</p>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Microsoft Teams OAuth Integration
                </CardTitle>
                <CardDescription>
                  This will allow Nexus to access your organization's Microsoft Teams data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Only organization administrators can perform this integration. You will be redirected to Microsoft's
                    secure OAuth flow.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold">Microsoft Graph API Permissions Required:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        User.Read
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Read Bot Identity</p>
                        <p className="text-xs text-slate-600">
                          Allows Nexus to know its own identity within your organization
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        Team.ReadBasic.All
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">List Teams</p>
                        <p className="text-xs text-slate-600">Allows Nexus to see which Teams it has been added to</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        Channel.ReadBasic.All
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">List Channels</p>
                        <p className="text-xs text-slate-600">
                          Allows Nexus to see channels within Teams it's a member of
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        ChannelMessage.Read.All
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Read Channel Messages</p>
                        <p className="text-xs text-slate-600">
                          Allows Nexus to read messages in channels it's a member of
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        Chat.Read.All
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Read Group Chat Messages</p>
                        <p className="text-xs text-slate-600">
                          Allows Nexus to read messages in group chats and meetings it's added to
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <Badge variant="outline" className="mt-0.5">
                        Files.Read.All
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Read Files and Attachments</p>
                        <p className="text-xs text-slate-600">
                          Allows Nexus to read files, images, videos, and documents shared in accessible channels and
                          chats to make content searchable
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleConnect} className="w-full" size="lg" disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect with Microsoft Teams"}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Connection Successful!
                </CardTitle>
                <CardDescription>Your organization has been successfully connected to Nexus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Nexus now has access to your Microsoft Teams organization. You can now manage bot permissions and
                    start data ingestion.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-semibold">Next Steps:</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Configure which teams and channels Nexus can access</li>
                    <li>• Set up approval workflows for new bot invitations</li>
                    <li>• Begin data ingestion from your Teams conversations</li>
                    <li>• Enable end-user chat access to the knowledge base</li>
                  </ul>
                </div>

                <Button onClick={handleComplete} className="w-full" size="lg">
                  Go to Admin Panel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
