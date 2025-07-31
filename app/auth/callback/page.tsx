"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useAuth()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("Processing your authentication...")

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const error = searchParams.get("error")

      if (error) {
        setStatus("error")
        setMessage("Authentication was cancelled or failed.")
        return
      }

      if (!code || !state) {
        setStatus("error")
        setMessage("Invalid authentication response.")
        return
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_AUTH_CALLBACK_ENDPOINT}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, state }),
          },
        )

        if (response.ok) {
          const { user, token } = await response.json()

          // Store token in localStorage or secure cookie
          localStorage.setItem("nexus_token", token)

          // Update auth context
          login(user.email, user.role)

          setStatus("success")
          setMessage("Authentication successful! Redirecting...")

          // Redirect based on user role
          setTimeout(() => {
            if (user.role === "end_user") {
              router.push("/chat")
            } else {
              router.push("/admin")
            }
          }, 2000)
        } else {
          throw new Error("Authentication failed")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Failed to complete authentication. Please try again.")
      }
    }

    handleCallback()
  }, [searchParams, router, login])

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
        </div>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              {status === "processing" && (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Processing...</span>
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Success!</span>
                </>
              )}
              {status === "error" && (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span>Error</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert
              className={
                status === "success"
                  ? "border-green-200 bg-green-50"
                  : status === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-blue-200 bg-blue-50"
              }
            >
              <AlertDescription
                className={
                  status === "success" ? "text-green-800" : status === "error" ? "text-red-800" : "text-blue-800"
                }
              >
                {message}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
