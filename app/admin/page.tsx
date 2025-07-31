"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  Activity,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function AdminPanel() {
  const { hasPermission, user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if not authenticated or no admin permission
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !hasPermission("access_admin_panel"))) {
      router.push("/login")
    }
  }, [isAuthenticated, hasPermission, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !hasPermission("access_admin_panel")) {
    return null // Will redirect via useEffect
  }
  // Fetch bot approvals from API
  const fetchBotApprovals = async () => {
    try {
      const token = localStorage.getItem("nexus_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_BOT_APPROVALS_ENDPOINT}?status=pending`, {
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPendingApprovals(data.requests || [])
      }
    } catch (error) {
      console.error("Failed to fetch bot approvals:", error)
      // Fallback to mock data for demo
      setPendingApprovals([
        {
          id: "1",
          channel_name: "Marketing Team",
          channel_type: "Team",
          requested_by: "Sarah Johnson",
          created_at: "2024-01-15T10:30:00Z",
          member_count: 12,
        },
        {
          id: "2", 
          channel_name: "Product Development",
          channel_type: "Channel",
          requested_by: "Mike Chen",
          created_at: "2024-01-15T09:15:00Z",
          member_count: 8,
        },
      ])
    }
  }

  // Approve/reject bot request
  const handleBotApproval = async (requestId: string, approved: boolean, reason?: string) => {
    try {
      setIsProcessing(true)
      const token = localStorage.getItem("nexus_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_BOT_APPROVALS_ENDPOINT}/${requestId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ approved, reason })
      })
      
      if (response.ok) {
        // Refresh approvals list
        fetchBotApprovals()
      }
    } catch (error) {
      console.error("Failed to process bot approval:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Fetch approvals on component mount
  useEffect(() => {
    fetchBotApprovals()
  }, [])

  const [activeChannels] = useState([
    {
      id: 1,
      name: "General",
      type: "Team",
      members: 45,
      messagesIngested: 1250,
      lastActivity: "2 minutes ago",
      status: "active",
    },
    {
      id: 2,
      name: "Engineering",
      type: "Team",
      members: 23,
      messagesIngested: 890,
      lastActivity: "5 minutes ago",
      status: "active",
    },
    {
      id: 3,
      name: "Sales Updates",
      type: "Channel",
      members: 15,
      messagesIngested: 456,
      lastActivity: "1 hour ago",
      status: "active",
    },
  ])

  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "moderator",
      status: "active",
    },
    {
      id: 3,
      name: "Peter Jones",
      email: "peter.jones@example.com",
      role: "member",
      status: "pending",
    },
  ])

  const handleApprove = (id: string) => {
    handleBotApproval(id, true)
  }

  const handleReject = (id: string) => {
    handleBotApproval(id, false)
  }

  if (!hasPermission("access_admin_panel")) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>You don't have permission to access the admin panel.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">Nexus Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Organization: Acme Corp</Badge>
            <Badge variant="outline">
              {user?.name} - {user?.role.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Channels</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Messages Ingested</p>
                  <p className="text-2xl font-bold">2,596</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold">83</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="approvals">
              Pending Approvals
              {pendingApprovals.length > 0 && (
                <Badge className="ml-2 bg-orange-100 text-orange-800">{pendingApprovals.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="channels">Active Channels</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {hasPermission("manage_users") && <TabsTrigger value="users">Users</TabsTrigger>}
          </TabsList>

          <TabsContent value="approvals">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Bot Access Requests</CardTitle>
                <CardDescription>
                  Review and approve requests for Nexus bot to join new channels and teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovals.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Channel/Team</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.channel_name || request.channelName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {request.channel_type || request.channelType}
                            </Badge>
                          </TableCell>
                          <TableCell>{request.requested_by || request.requestedBy}</TableCell>
                          <TableCell>{request.member_count || request.members}</TableCell>
                          <TableCell>
                            {request.created_at ? new Date(request.created_at).toLocaleString() : request.requestedAt}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isProcessing}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleReject(request.id)}
                                disabled={isProcessing}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>No pending approval requests at this time.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Active Channels & Teams</CardTitle>
                <CardDescription>
                  Channels and teams where Nexus bot is currently active and ingesting data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Messages Ingested</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeChannels.map((channel) => (
                      <TableRow key={channel.id}>
                        <TableCell className="font-medium">{channel.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{channel.type}</Badge>
                        </TableCell>
                        <TableCell>{channel.members}</TableCell>
                        <TableCell>{channel.messagesIngested.toLocaleString()}</TableCell>
                        <TableCell>{channel.lastActivity}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{channel.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle>Data Ingestion Settings</CardTitle>
                  <CardDescription>
                    Configure how Nexus ingests and processes data from your Microsoft Teams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-approve internal team requests</h4>
                      <p className="text-sm text-slate-600">
                        Automatically approve bot requests from verified team members
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Real-time data ingestion</h4>
                      <p className="text-sm text-slate-600">Process messages and files as they are shared</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Include file attachments</h4>
                      <p className="text-sm text-slate-600">Process and index file attachments shared in channels</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>Manage security settings and data privacy controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      All data is encrypted in transit and at rest. Nexus complies with your organization's data
                      retention policies.
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data retention period</h4>
                      <p className="text-sm text-slate-600">
                        Automatically delete processed data after specified period
                      </p>
                    </div>
                    <Badge variant="outline">90 days</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {hasPermission("manage_users") && (
            <TabsContent value="users">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Quick overview of user management. Visit the full user management page for more options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">{users.length} total users in your organization</p>
                      <div className="flex space-x-4 text-sm">
                        <span>Active: {users.filter((u) => u.status === "active").length}</span>
                        <span>Pending: {users.filter((u) => u.status === "pending").length}</span>
                      </div>
                    </div>
                    <Link href="/admin/users">
                      <Button>
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
