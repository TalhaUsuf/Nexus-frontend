const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Database operations
class Database {
  // Organizations
  async createOrganization(org) {
    const { data, error } = await supabase
      .from('organizations')
      .insert(org)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getOrganization(id) {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Users
  async createUser(user) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUsersByOrganization(organizationId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    return data;
  }

  // Invitations
  async createInvitation(invitation) {
    const { data, error } = await supabase
      .from('invitations')
      .insert(invitation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getInvitationByToken(token) {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateInvitation(id, updates) {
    const { data, error } = await supabase
      .from('invitations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Bot Requests
  async createBotRequest(request) {
    const { data, error } = await supabase
      .from('bot_requests')
      .insert(request)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getBotRequestsByOrganization(organizationId, status = null) {
    let query = supabase
      .from('bot_requests')
      .select('*')
      .eq('organization_id', organizationId);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async updateBotRequest(id, updates) {
    const { data, error } = await supabase
      .from('bot_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Conversations
  async createConversation(conversation) {
    const { data, error } = await supabase
      .from('conversations')
      .insert(conversation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getConversation(id) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Messages
  async createMessage(message) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getMessagesByConversation(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // References
  async createReference(reference) {
    const { data, error } = await supabase
      .from('references')
      .insert(reference)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getReference(id) {
    const { data, error } = await supabase
      .from('references')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}

module.exports = new Database();