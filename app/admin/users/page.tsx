"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  UserPlus,
  MoreHorizontal,
  Shield,
  Users,
  Crown,
  User,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { apiCall, getErrorMessage, type ApiError } from "@/lib/utils"

const roleConfig = {
  super_admin: {
    label: "Super Admin",
    icon: Crown,
    color: "bg-purple-100 text-purple-800",
    description: "Full platform access",
  },
  org_admin: {
    label: "Organization Admin",
    icon: Shield,
    color: "bg-blue-100 text-blue-800",
    description: "Organization-level control",
  },
  team_lead: {
    label: "Team Lead",
    icon: Users,
    color: "bg-green-100 text-green-800",
    description: "Team-level permissions",
  },
  end_user: {
    label: "End User",
    icon: User,
    color: "bg-gray-100 text-gray-800",
    description: "Basic chat access",
  },
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800", icon: AlertTriangle },
}

export default function UsersPage() {
  const { users: authUsers, hasPermission } = useAuth()
  const [users, setUsers] = useState(authUsers)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<UserRole>("end_user")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch users from backend
  const fetchUsers = async () => {
    const { data, error } = await apiCall(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_USERS_ENDPOINT}`
    )
    
    if (error) {
      setError(getErrorMessage(error))
    } else {
      setUsers(data || authUsers)
      setError(null)
    }
  }

  // Invite user via API
  const inviteUser = async (email: string, role: UserRole) => {
    const { data, error } = await apiCall(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_USERS_INVITE_ENDPOINT}`,
      {
        method: "POST",
        body: JSON.stringify({ email, role })
      }
    )
    
    if (error) {
      setError(getErrorMessage(error))
    } else {
      setSuccess("User invitation sent successfully!")
      setError(null)
      // Refresh users list
      fetchUsers()
    }
  }

  // Update user role via API
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    const { data, error } = await apiCall(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/role`,
      {
        method: "PUT",
        body: JSON.stringify({ role: newRole })
      }
    )
    
    if (error) {
      setError(getErrorMessage(error))
    } else {
      setSuccess("User role updated successfully!")
      setError(null)
      // Refresh users list
      fetchUsers()
    }
  }

  // Remove user via API
  const removeUser = async (userId: string) => {
    const { data, error } = await apiCall(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}`,
      {
        method: "DELETE"
      }
    )
    
    if (error) {
      setError(getErrorMessage(error))
    } else {
      setSuccess("User removed successfully!")
      setError(null)
      // Refresh users list
      fetchUsers()
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  if (!hasPermission("manage_users")) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>You don't have permission to access user management.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleInviteUser = async () => {
    if (inviteEmail && inviteRole) {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      await inviteUser(inviteEmail, inviteRole)
      setInviteEmail("")
      setInviteRole("end_user")
      setIsInviteOpen(false)
      setIsLoading(false)
      
      // Clear success message after 3 seconds
      if (!error) {
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole(userId, newRole)
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const pendingUsers = users.filter((u) => u.status === "pending").length

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-xl font-bold">User Management</h1>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>Send an invitation to join your organization's Nexus platform.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@acmecorp.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value: UserRole) => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([role, config]) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center space-x-2">
                            <config.icon className="w-4 h-4" />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteUser} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Invites</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingUsers}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Admins</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter((u) => u.role === "org_admin" || u.role === "super_admin").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle>Organization Users</CardTitle>
            <CardDescription>Manage user roles and permissions for your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const roleInfo = roleConfig[user.role]
                  const statusInfo = statusConfig[user.status]
                  const RoleIcon = roleInfo.icon
                  const StatusIcon = statusInfo.icon

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleInfo.color}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            {Object.entries(roleConfig).map(([role, config]) => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => handleRoleChange(user.id, role as UserRole)}
                                disabled={user.role === role}
                              >
                                <config.icon className="w-4 h-4 mr-2" />
                                {config.label}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => removeUser(user.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
