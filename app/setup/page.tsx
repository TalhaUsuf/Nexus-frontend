"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Database, CheckCircle, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SetupPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    jobTitle: "",
    phoneNumber: "",
    timezone: "",
    notifications: true,
  })

  const departments = [
    "Engineering",
    "Product",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Customer Success",
    "Legal",
    "Other",
  ]

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
  ]

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("nexus_token")
      
      // API call to save user profile
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_USERS_PROFILE_ENDPOINT}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Redirect to chat page
        router.push("/chat")
      }
    } catch (error) {
      console.error("Setup failed:", error)
      // For demo, just redirect anyway
      setTimeout(() => {
        router.push("/chat")
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Nexus</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Nexus!</h1>
          <p className="text-slate-600">Let's set up your profile to get you started</p>
        </div>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Account Setup</CardTitle>
              <span className="text-sm text-slate-500">Step {step} of 3</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Your work information"}
              {step === 3 && "Preferences and notifications"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="bg-slate-50" />
                  <p className="text-xs text-slate-500 mt-1">This email is linked to your invitation</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace("_", " ").replace("/", " / ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>You're almost ready!</strong> Once you complete setup, you'll have access to your
                    organization's knowledge base and can start asking questions immediately.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <div className="ml-auto">
                <Button onClick={handleNext} disabled={isLoading}>
                  {isLoading ? (
                    "Setting up..."
                  ) : step === 3 ? (
                    <>
                      Complete Setup
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Need help? Contact your organization's IT administrator or{" "}
            <a href="#" className="text-blue-600 hover:underline">
              visit our help center
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
