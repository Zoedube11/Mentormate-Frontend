const API_BASE_URL = 'http://localhost:5000';

// Get user email from localStorage
const getUserEmail = () => {
  const email = localStorage.getItem('userEmail');
  if (!email) {
    throw new Error('User not logged in');
  }
  return email;
};

/**
 * Fetch all chat sessions for the authenticated user
 * @param {string} collectionName - Optional filter by collection
 * @param {number} limit - Optional limit number of sessions returned
 * @returns {Promise<Object>} - Response containing user_id, total_session, and session array
 */
export const fetchChatSessions = async (collectionName = null, limit = null) => {
  const userEmail = getUserEmail();
  const params = new URLSearchParams();
  
  if (collectionName) params.append('collection_name', collectionName);
  if (limit) params.append('limit', limit.toString());
  
  const response = await fetch(
    `${API_BASE_URL}/chat_history/${encodeURIComponent(userEmail)}?${params}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch chat sessions: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Fetch a specific conversation with all messages
 * @param {string} conversationId - The conversation ID to fetch
 * @param {boolean} includeChunks - Whether to include RAG chunks
 * @returns {Promise<Object>} - Response containing conversation details and messages
 */
export const fetchConversation = async (conversationId, includeChunks = false) => {
  const userEmail = getUserEmail();
  const params = new URLSearchParams();
  
  if (includeChunks) params.append('include_chunks', 'true');
  
  const response = await fetch(
    `${API_BASE_URL}/chat_history/${encodeURIComponent(userEmail)}/session/${conversationId}?${params}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Delete conversation(s) for the authenticated user
 * @param {string} conversationId - Optional specific conversation to delete
 * @param {string} collectionName - Optional filter by collection
 * @returns {Promise<Object>} - Response with status, deleted_count, and user_id
 */
export const deleteHistory = async (conversationId = null, collectionName = null) => {
  const userEmail = getUserEmail();
  const params = new URLSearchParams();
  
  if (conversationId) params.append('conversation_id', conversationId);
  if (collectionName) params.append('collection_name', collectionName);
  
  const response = await fetch(
    `${API_BASE_URL}/chat_history/${encodeURIComponent(userEmail)}/delete?${params}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to delete history: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Delete a specific conversation
 * @param {string} conversationId - The conversation ID to delete
 * @returns {Promise<Object>}
 */
export const deleteConversation = (conversationId) => deleteHistory(conversationId);

/**
 * Delete all conversations for a specific collection
 * @param {string} collectionName - The collection name to delete history for
 * @returns {Promise<Object>}
 */
export const deleteCollectionHistory = (collectionName) => deleteHistory(null, collectionName);

/**
 * Delete all conversations for the user
 * @returns {Promise<Object>}
 */
export const deleteAllHistory = () => deleteHistory();

/**
 * Get collection display name from technical name
 * @param {string} collectionName - Technical collection name
 * @returns {string} - Display friendly name
 */
export const getCollectionDisplayName = (collectionName) => {
  const collectionMap = {
    'Concrete_docs': 'Bra Vusi - Concrete & Structures',
    'Water_docs': 'Mama Dudu - Water Management',
    'Tailings_engineer_docs': 'Oom Piet - Geotechnical',
    'Electrical_docs': 'Mr Rakesh - Electrical',
    'Mining_docs': 'Sis Nandi - Mining',
  };
  return collectionMap[collectionName] || collectionName;
};

/**
 * Get expert route from collection name
 * @param {string} collectionName - Technical collection name
 * @returns {string} - Route path
 */
export const getExpertRoute = (collectionName) => {
  const routeMap = {
    'Concrete_docs': '/chat_bra_vusi',
    'Water_docs': '/chat_mama_dudu',
    'Tailings_engineer_docs': '/chat_oom_piet',
    'Electrical_docs': '/chat_mr_rakesh',
    'Mining_docs': '/chat_sis_nandi',
  };
  return routeMap[collectionName] || '/mentormate-homepage';
};
