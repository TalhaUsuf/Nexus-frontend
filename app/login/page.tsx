"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Database, Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [inviteToken] = useState(searchParams.get("token"))
  const [inviteEmail] = useState(searchParams.get("email"))

  useEffect(() => {
    if (inviteEmail) {
      setEmail(inviteEmail)
    }
  }, [inviteEmail])

  const handleMicrosoftLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate Microsoft OAuth flow
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_AUTH_MICROSOFT_ENDPOINT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            redirect_uri: `${window.location.origin}/auth/callback`,
            invite_token: inviteToken,
          }),
        },
      )

      if (response.ok) {
        const { auth_url } = await response.json()
        window.location.href = auth_url
      } else {
        throw new Error("Failed to initiate Microsoft login")
      }
    } catch (err) {
      setError("Failed to connect with Microsoft. Please try again.")
      setIsLoading(false)
    }
  }

  const handleInviteLogin = async () => {
    if (!email || !inviteToken) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_AUTH_INVITE_LOGIN_ENDPOINT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invite_token: inviteToken, email }),
        },
      )

      if (response.ok) {
        const { user, requires_setup } = await response.json()
        login(user.email, user.role)

        if (requires_setup) {
          router.push("/setup")
        } else {
          router.push("/chat")
        }
      } else {
        throw new Error("Invalid invitation or email")
      }
    } catch (err) {
      setError("Invalid invitation link or email address.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Nexus</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Nexus</h1>
          <p className="text-slate-600">
            {inviteToken
              ? "Complete your invitation to join your organization"
              : "Sign in to access your knowledge hub"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{inviteToken ? "Accept Invitation" : "Sign In"}</CardTitle>
            <CardDescription className="text-center">
              {inviteToken
                ? "You've been invited to join your organization's Nexus knowledge platform. Complete the steps below to activate your account and start accessing your team's collective intelligence."
                : "Access your organization's knowledge assistant"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {inviteToken && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Invitation Received!</strong> You have a valid invitation to join your organization's Nexus
                  platform. Choose your preferred sign-in method below to get started.
                </AlertDescription>
              </Alert>
            )}

            {/* Microsoft Login */}
            <div>
              <Button
                onClick={handleMicrosoftLogin}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                {isLoading ? "Connecting..." : "Continue with Microsoft"}
              </Button>
              <p className="text-xs text-slate-500 text-center mt-2">
                Secure sign-in with your organization's Microsoft account
              </p>
            </div>

            {inviteToken && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or verify with email</span>
                  </div>
                </div>

                {/* Email Verification for Invite */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the email address where you received the invitation
                    </p>
                  </div>

                  <Button onClick={handleInviteLogin} className="w-full" disabled={!email || isLoading}>
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}

            <div className="text-center">
              <p className="text-xs text-slate-500">
                By signing in, you agree to your organization's terms of service and privacy policy.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">Need help? Contact your organization's IT administrator.</p>
        </div>
      </div>
    </div>
  )
}
