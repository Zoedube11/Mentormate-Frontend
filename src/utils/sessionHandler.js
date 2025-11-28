// Centralized session expiration handler for graceful UX

const API_BASE_URL = 'http://localhost:5000';

/**
 * Check if the response indicates a session expiration
 */
export const isSessionExpired = (response) => {
  return response.status === 401 || response.status === 403;
};

/**
 * Handle session expiration with user-friendly notifications
 */
export const handleSessionExpiration = (navigate, customMessage = null) => {
  // Clear all user data from localStorage
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userPicture');
  localStorage.removeItem('token');
  
  // Clear chat history cache to prevent data leak
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('chat_history')) {
      localStorage.removeItem(key);
    }
  });

  // Show user-friendly message
  const message = customMessage || 'Your session has expired. Please sign in again to continue.';
  
  // Navigate to auth page with message
  navigate('/', { 
    state: { 
      sessionExpired: true,
      message: message
    },
    replace: true
  });
};

/**
 * Enhanced fetch wrapper with automatic session handling
 */
export const fetchWithAuth = async (url, options = {}, navigate = null) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Check for session expiration
    if (isSessionExpired(response)) {
      if (navigate) {
        handleSessionExpiration(navigate);
      }
      throw new Error('Session expired');
    }

    return response;
  } catch (error) {
    // If network error or session expired, handle appropriately
    if (error.message === 'Session expired') {
      throw error;
    }
    
    // For other network errors, throw with context
    throw new Error(`Network error: ${error.message}`);
  }
};

/**
 * Check session validity before performing sensitive operations
 */
export const validateSession = async (navigate) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/check-session`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok || !data.authenticated) {
      handleSessionExpiration(navigate, 'Your session is no longer valid. Please sign in again.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    handleSessionExpiration(navigate, 'Unable to verify your session. Please sign in again.');
    return false;
  }
};

/**
 * Periodic session check for long-running pages (like chat)
 * Returns cleanup function
 */
export const startSessionMonitoring = (navigate, intervalMs = 5 * 60 * 1000) => {
  const checkSession = async () => {
    const isValid = await validateSession(navigate);
    if (!isValid) {
      console.log('Session monitoring detected expiration');
    }
  };

  // Check immediately
  checkSession();

  // Then check periodically
  const intervalId = setInterval(checkSession, intervalMs);

  // Return cleanup function
  return () => clearInterval(intervalId);
};

export { API_BASE_URL };
