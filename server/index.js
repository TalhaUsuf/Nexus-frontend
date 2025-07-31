const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// In-memory database (replace with real database in production)
const db = {
  organizations: new Map(),
  users: new Map(),
  invitations: new Map(),
  botRequests: new Map(),
  conversations: new Map(),
  messages: new Map(),
  references: new Map()
};

// Email transporter setup
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      organizationId: user.organizationId 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Send email helper
const sendEmail = async (to, subject, html) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@nexus.com',
      to,
      subject,
      html
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Initialize sample data
const initializeData = () => {
  // Create sample organization
  const orgId = uuidv4();
  db.organizations.set(orgId, {
    id: orgId,
    name: 'Acme Corp',
    domain: 'acmecorp.com',
    microsoftTenantId: 'sample-tenant-id',
    createdAt: new Date().toISOString()
  });

  // Create sample admin user
  const adminId = uuidv4();
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.users.set(adminId, {
    id: adminId,
    email: 'admin@acmecorp.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'org_admin',
    status: 'active',
    department: 'IT',
    jobTitle: 'System Administrator',
    organizationId: orgId,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  });

  console.log('Sample data initialized');
  console.log('Admin login: admin@acmecorp.com / admin123');
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Microsoft OAuth initiation
app.post('/api/auth/microsoft', async (req, res) => {
  try {
    const { redirect_uri } = req.body;
    
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const scope = 'User.Read Team.ReadBasic.All Channel.ReadBasic.All ChannelMessage.Read.All Chat.Read.All Files.Read.All';
    const state = uuidv4();
    
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `response_mode=query`;

    res.json({ auth_url: authUrl, state });
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    res.status(500).json({ error: 'Failed to initiate OAuth' });
  }
});

// OAuth callback
app.post('/api/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    // In production, exchange code for tokens with Microsoft
    // For demo, create/update admin user
    const orgId = Array.from(db.organizations.keys())[0];
    const adminUser = Array.from(db.users.values()).find(u => u.role === 'org_admin');
    
    if (adminUser) {
      adminUser.microsoftConnected = true;
      adminUser.lastActive = new Date().toISOString();
      
      const token = generateToken(adminUser);
      
      res.json({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: `${adminUser.firstName} ${adminUser.lastName}`,
          role: adminUser.role
        },
        token
      });
    } else {
      res.status(404).json({ error: 'Admin user not found' });
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'OAuth callback failed' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  try {
    const user = db.users.get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        status: user.status,
        organizationId: user.organizationId
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
});
// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = Array.from(db.users.values()).find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastActive = new Date().toISOString();
    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Invite login (for email invitations)
app.post('/api/auth/invite-login', async (req, res) => {
  try {
    const { invite_token, email } = req.body;
    
    const invitation = Array.from(db.invitations.values()).find(
      inv => inv.token === invite_token && inv.email === email
    );
    
    if (!invitation) {
      return res.status(400).json({ error: 'Invalid invitation' });
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return res.status(400).json({ error: 'Invitation expired' });
    }

    // Check if user already exists
    let user = Array.from(db.users.values()).find(u => u.email === email);
    
    if (!user) {
      // Create new user
      const userId = uuidv4();
      user = {
        id: userId,
        email: email,
        firstName: '',
        lastName: '',
        role: invitation.role,
        status: 'pending',
        organizationId: invitation.organizationId,
        password: '', // Will be set during setup
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      db.users.set(userId, user);
    }

    // Mark invitation as used
    invitation.usedAt = new Date().toISOString();

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      },
      requires_setup: !user.firstName || !user.lastName,
      token
    });
  } catch (error) {
    console.error('Invite login error:', error);
    res.status(500).json({ error: 'Invite login failed' });
  }
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireRole(['org_admin', 'super_admin']), (req, res) => {
  try {
    const users = Array.from(db.users.values())
      .filter(u => u.organizationId === req.user.organizationId)
      .map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`.trim() || u.email,
        email: u.email,
        role: u.role,
        status: u.status,
        department: u.department,
        jobTitle: u.jobTitle,
        lastActive: u.lastActive,
        avatar: u.avatarUrl
      }));

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Invite user (admin only)
app.post('/api/users/invite', authenticateToken, requireRole(['org_admin', 'super_admin']), async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Check if user already exists
    const existingUser = Array.from(db.users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create invitation
    const invitationId = uuidv4();
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = {
      id: invitationId,
      email,
      role,
      token,
      expiresAt: expiresAt.toISOString(),
      createdById: req.user.id,
      organizationId: req.user.organizationId,
      createdAt: new Date().toISOString()
    };

    db.invitations.set(invitationId, invitation);

    // Send invitation email
    const inviteUrl = `${process.env.FRONTEND_URL}/login?token=${token}&email=${encodeURIComponent(email)}`;
    const organization = db.organizations.get(req.user.organizationId);
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">You're invited to join ${organization.name} on Nexus</h2>
        <p>Hello,</p>
        <p>You've been invited to join <strong>${organization.name}</strong>'s Nexus knowledge platform as a <strong>${role.replace('_', ' ')}</strong>.</p>
        <p>Nexus is an AI-powered knowledge assistant that helps teams access and share information from Microsoft Teams conversations and files.</p>
        <div style="margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a>
        </div>
        <p>This invitation will expire in 7 days.</p>
        <p>If you have any questions, please contact your organization administrator.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">This email was sent by Nexus Knowledge Platform</p>
      </div>
    `;

    const emailSent = await sendEmail(
      email,
      `Invitation to join ${organization.name} on Nexus`,
      emailHtml
    );

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send invitation email' });
    }

    res.json({ 
      message: 'Invitation sent successfully',
      invitation: {
        id: invitationId,
        email,
        role,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Update user profile
app.put('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const { firstName, lastName, department, jobTitle, phoneNumber, timezone } = req.body;
    
    const user = db.users.get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user profile
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.department = department || user.department;
    user.jobTitle = jobTitle || user.jobTitle;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.timezone = timezone || user.timezone;
    user.status = 'active'; // Activate user after profile setup
    user.updatedAt = new Date().toISOString();

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get bot approval requests
app.get('/api/bot-approvals', authenticateToken, requireRole(['org_admin', 'super_admin']), (req, res) => {
  try {
    const { status } = req.query;
    
    let requests = Array.from(db.botRequests.values())
      .filter(r => r.organizationId === req.user.organizationId);
    
    if (status) {
      requests = requests.filter(r => r.status === status);
    }

    const formattedRequests = requests.map(r => ({
      id: r.id,
      channel_name: r.channelName,
      channel_type: r.channelType,
      requested_by: r.requestedBy,
      member_count: r.memberCount,
      created_at: r.createdAt,
      status: r.status
    }));

    res.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Get bot approvals error:', error);
    res.status(500).json({ error: 'Failed to fetch bot approvals' });
  }
});

// Approve/reject bot request
app.post('/api/bot-approvals/:id/approve', authenticateToken, requireRole(['org_admin', 'super_admin']), (req, res) => {
  try {
    const { id } = req.params;
    const { approved, reason } = req.body;
    
    const request = db.botRequests.get(id);
    if (!request) {
      return res.status(404).json({ error: 'Bot request not found' });
    }

    request.status = approved ? 'approved' : 'rejected';
    request.approvedById = req.user.id;
    request.reason = reason;
    request.updatedAt = new Date().toISOString();

    res.json({ 
      message: `Bot request ${approved ? 'approved' : 'rejected'} successfully`,
      request: {
        id: request.id,
        status: request.status
      }
    });
  } catch (error) {
    console.error('Bot approval error:', error);
    res.status(500).json({ error: 'Failed to process bot approval' });
  }
});

// Send chat message
app.post('/api/chat/message', authenticateToken, (req, res) => {
  try {
    const { message, conversation_id } = req.body;
    
    // Get or create conversation
    let conversationId = conversation_id;
    if (!conversationId || conversationId === 'current_conversation') {
      conversationId = uuidv4();
      db.conversations.set(conversationId, {
        id: conversationId,
        userId: req.user.id,
        title: message.substring(0, 50) + '...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Save user message
    const userMessageId = uuidv4();
    db.messages.set(userMessageId, {
      id: userMessageId,
      conversationId,
      content: message,
      role: 'user',
      createdAt: new Date().toISOString()
    });

    // Generate AI response (mock)
    const aiResponse = generateAIResponse(message);
    const aiMessageId = uuidv4();
    db.messages.set(aiMessageId, {
      id: aiMessageId,
      conversationId,
      content: aiResponse.content,
      role: 'assistant',
      sources: JSON.stringify(aiResponse.sources),
      createdAt: new Date().toISOString()
    });

    res.json({
      response: aiResponse.content,
      sources: aiResponse.sources,
      conversation_id: conversationId
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get reference details
app.get('/api/chat/reference/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock reference data
    const reference = {
      id,
      title: `Reference from Teams Channel`,
      type: 'message',
      source: 'Marketing Team',
      timestamp: new Date().toLocaleString(),
      author: 'Team Member',
      fullContent: `This is the full content of the reference. It contains detailed information about the topic discussed, including specific data points, decisions made, and action items identified during the conversation.

The discussion covered multiple aspects:
1. Technical implementation details
2. Timeline and milestones  
3. Resource allocation
4. Risk assessment and mitigation strategies

Key participants shared their insights and the team reached consensus on the proposed approach.`,
      metadata: {
        channel: 'Marketing Team',
        team: 'Product Development',
        messageId: `msg_${id}`,
        participants: ['Sarah Johnson', 'Mike Chen', 'Alex Wilson'],
        url: `https://teams.microsoft.com/l/message/${id}`
      },
      context: {
        threadContext: 'This message was part of a larger thread about Q4 planning',
        previousMessage: 'Previous context about the discussion topic...',
        nextMessage: 'Follow-up message with additional details...'
      }
    };

    res.json({ reference });
  } catch (error) {
    console.error('Get reference error:', error);
    res.status(500).json({ error: 'Failed to fetch reference' });
  }
});

// Helper function to generate AI responses
function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    'q4': {
      content: "Based on discussions in the Marketing Team and Product Development channels, the key Q4 priorities include: 1) Launching the new product beta by October 15th, 2) Increasing customer acquisition by 25%, and 3) Implementing the new CRM system. The marketing team has allocated additional budget for digital campaigns, and engineering is focusing on performance optimizations.",
      sources: [
        { title: "Marketing Team Channel", id: "ref_1" },
        { title: "Product Development", id: "ref_2" },
        { title: "Q4 Planning Meeting", id: "ref_3" }
      ]
    },
    'meeting': {
      content: "From last week's standup notes in the Engineering channel: The team completed 8 story points, resolved 3 critical bugs, and started work on the authentication system. Sarah mentioned the API integration is 80% complete, and Mike flagged potential performance issues that need investigation. Next sprint planning is scheduled for Friday.",
      sources: [
        { title: "Engineering Standup", id: "ref_4" },
        { title: "Sprint Planning Notes", id: "ref_5" }
      ]
    },
    'launch': {
      content: "According to the Product Development channel, the beta release is scheduled for October 15th. The current status shows: UI/UX design is complete, backend APIs are 85% done, and QA testing begins next week. The team is confident about meeting the deadline, but they've identified database optimization as a potential risk factor.",
      sources: [
        { title: "Product Development", id: "ref_6" },
        { title: "Beta Release Timeline", id: "ref_7" }
      ]
    }
  };

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return {
    content: "I found relevant information from your Teams channels. Based on recent discussions, I can provide insights about your team's projects, meetings, and shared documents. Could you be more specific about what you'd like to know?",
    sources: [
      { title: "General", id: "ref_general" },
      { title: "Team Discussions", id: "ref_team" }
    ]
  };
}

// Add some sample bot requests for demo
const addSampleBotRequests = () => {
  const orgId = Array.from(db.organizations.keys())[0];
  
  const request1 = {
    id: uuidv4(),
    channelName: 'Marketing Team',
    channelType: 'Team',
    requestedBy: 'Sarah Johnson',
    memberCount: 12,
    status: 'pending',
    organizationId: orgId,
    createdAt: new Date().toISOString()
  };
  
  const request2 = {
    id: uuidv4(),
    channelName: 'Product Development',
    channelType: 'Channel', 
    requestedBy: 'Mike Chen',
    memberCount: 8,
    status: 'pending',
    organizationId: orgId,
    createdAt: new Date().toISOString()
  };

  db.botRequests.set(request1.id, request1);
  db.botRequests.set(request2.id, request2);
};

// Initialize data and start server
initializeData();
addSampleBotRequests();

app.listen(PORT, () => {
  console.log(`🚀 Nexus Backend Server running on port ${PORT}`);
  console.log(`📧 Email service configured: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`\n📋 Sample Admin Login:`);
  console.log(`   Email: admin@acmecorp.com`);
  console.log(`   Password: admin123`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});