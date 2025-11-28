// Centralized authentication utility for session-based auth
// Note: This file is kept for backwards compatibility
// New code should use sessionHandler.js instead

import { validateSession, handleSessionExpiration, API_BASE_URL } from './sessionHandler';

export const checkSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/check-session`, {
      credentials: 'include'
    });
    const data = await response.json();
    return {
      isAuthenticated: data.authenticated || false,
      user: data.user_data || null
    };
  } catch (error) {
    console.error('Session check error:', error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
};

export const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    // Clear localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPicture');
    localStorage.removeItem('token');
    
    // Clear chat history cache
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('chat_history')) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const API_URL = API_BASE_URL;
