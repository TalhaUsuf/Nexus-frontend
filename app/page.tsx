"use client"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  MessageSquare,
  Shield,
  Zap,
  Database,
  ArrowRight,
  CheckCircle,
  Users,
  Brain,
  Lock,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function LandingPage() {
  const { user, hasPermission } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nexus
              </span>
              <div className="text-xs text-slate-500 font-medium">Knowledge Platform</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {hasPermission("access_admin_panel") ? (
              <Link href="/admin">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Admin Panel
                </Button>
              </Link>
            ) : null}
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                Launch Chat
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            {user && (
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {user.name}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Microsoft Teams Integration
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-slate-900">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Team Knowledge
              </span>
              <br />
              <span className="text-slate-900">Into Intelligence</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Nexus transforms your Microsoft Teams conversations, files, and meetings into an intelligent, searchable
              knowledge base that your entire organization can chat with instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/oauth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl px-8 py-4 text-lg"
                >
                  <Building2 className="w-6 h-6 mr-3" />
                  Connect Your Organization
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-blue-300 px-8 py-4 text-lg bg-transparent"
                >
                  View Live Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Platform Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need for
              <span className="text-blue-600"> Smart Knowledge Management</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to transform how your organization captures, organizes, and accesses knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-4">AI-Powered Intelligence</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Advanced AI automatically processes and understands your team conversations, extracting key insights
                  and making them instantly searchable.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-4">Enterprise-Grade Security</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Complete admin control with granular permissions, approval workflows, and enterprise security
                  standards that protect your sensitive data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-4">Instant Knowledge Access</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Chat with your organization's collective knowledge. Get instant answers with source references from
                  your Teams conversations and files.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Sync</h3>
              <p className="text-sm text-slate-600">Continuous data ingestion from all your Teams channels</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Team Collaboration</h3>
              <p className="text-sm text-slate-600">Role-based access for different team members</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-sm text-slate-600">Track usage and knowledge patterns</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Global Search</h3>
              <p className="text-sm text-slate-600">Find information across all connected channels</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Get Started in
              <span className="text-purple-600"> Four Simple Steps</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transform your team's knowledge management in minutes, not months.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-orange-200"></div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Connect Microsoft Teams</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Secure OAuth integration with your organization's Microsoft Teams workspace in just one click.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Invite Nexus Bot</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Team members invite the Nexus bot to relevant channels and conversations for data access.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Admin Approval</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Administrators review and approve bot access requests to maintain security and control.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Start Chatting</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Begin asking questions and get instant answers from your organization's collective knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Trusted by Forward-Thinking Organizations
            </h2>
            <p className="text-lg text-slate-600">
              Join thousands of teams already transforming their knowledge management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 border-0 shadow-lg bg-white">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Nexus has revolutionized how our team accesses and shares knowledge. What used to take hours of
                searching now takes seconds."
              </p>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm text-slate-500">CTO, TechCorp</div>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg bg-white">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "The security controls and admin oversight give us complete confidence in deploying Nexus across our
                organization."
              </p>
              <div className="font-semibold">Michael Chen</div>
              <div className="text-sm text-slate-500">CISO, GlobalTech</div>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg bg-white">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Our new employee onboarding time has been cut in half thanks to instant access to institutional
                knowledge."
              </p>
              <div className="font-semibold">Emily Rodriguez</div>
              <div className="text-sm text-slate-500">Head of HR, InnovateCo</div>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-slate-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-slate-600">Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-slate-600">Messages Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-slate-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <br />
            Team's Knowledge?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Join thousands of organizations already using Nexus to unlock their collective intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/oauth">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-100 shadow-xl px-8 py-4 text-lg font-semibold"
              >
                <Building2 className="w-6 h-6 mr-3" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Nexus</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Transforming organizational knowledge into actionable intelligence through AI-powered conversation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2024 Nexus. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
