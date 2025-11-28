# Session Expiration Handling

## Overview
This application now includes comprehensive session expiration handling to provide a seamless user experience when authentication sessions expire.

## Features

### 1. **Automatic Session Monitoring**
- All protected pages (homepage, chat pages) automatically monitor session validity
- Checks occur every 5 minutes by default
- Runs in the background without impacting user experience

### 2. **Graceful Session Expiration**
When a session expires, the system:
- Automatically redirects to the login page
- Displays a user-friendly notification
- Clears all user data and chat history cache
- Prevents data leakage between sessions

### 3. **Enhanced Fetch Wrapper**
All API calls use `fetchWithAuth()` which:
- Automatically includes authentication credentials
- Detects 401/403 status codes (session expired)
- Triggers automatic logout and redirect
- Prevents unnecessary error messages when session expires

### 4. **Visual Feedback**
- Session expiration messages appear at the top of the login page
- Amber-colored alert box with warning icon
- Message auto-dismisses after 8 seconds
- Clear, actionable text: "Your session has expired. Please sign in again to continue."

## Implementation Details

### Files Modified

#### Core Session Handler
**`src/utils/sessionHandler.js`** - Centralized session management
- `isSessionExpired(response)` - Checks if API response indicates expired session
- `handleSessionExpiration(navigate, message)` - Clears data and redirects to login
- `fetchWithAuth(url, options, navigate)` - Enhanced fetch with automatic session handling
- `validateSession(navigate)` - Validates current session state
- `startSessionMonitoring(navigate, intervalMs)` - Periodic session checks (5 min default)

#### Chat Pages Updated
All mentor chat pages now include session handling:
- **MamaDuduChat.jsx** - Water Management expert
- **BraVusiChat.jsx** - Concrete/Structural expert  
- **MrRakeshChat.jsx** - Electrical expert
- **SisNandiChat.jsx** - Mining expert
- **OomPietChat.jsx** - Geotechnical/Tailings expert

Changes per chat page:
1. Import session handler utilities
2. Add session monitoring on mount
3. Replace `fetch()` calls with `fetchWithAuth()`
4. Handle session expiration gracefully (no error messages when redirecting)

#### Other Pages
- **MentorMateHomePage.jsx** - Homepage with session monitoring
- **AuthPage.jsx** - Login page displays session expiration notifications

#### Utilities
- **auth.js** - Updated to clear chat history on logout and reference sessionHandler

## Usage Examples

### Using fetchWithAuth in Components
```javascript
import { fetchWithAuth } from "../utils/sessionHandler";
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  
  const sendRequest = async () => {
    try {
      const response = await fetchWithAuth(
        'http://localhost:5000/api/endpoint',
        {
          method: 'POST',
          body: JSON.stringify({ data: 'value' })
        },
        navigate
      );
      
      const data = await response.json();
      // Handle response...
      
    } catch (error) {
      // Session expired errors are handled automatically
      if (error.message === 'Session expired') {
        return; // User is being redirected
      }
      
      // Handle other errors
      console.error('Request failed:', error);
    }
  };
}
```

### Adding Session Monitoring to New Pages
```javascript
import { startSessionMonitoring } from "../utils/sessionHandler";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function MyProtectedPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Start monitoring, cleanup on unmount
    const cleanup = startSessionMonitoring(navigate);
    return cleanup;
  }, [navigate]);
  
  // Rest of component...
}
```

### Manually Validating Session Before Sensitive Operations
```javascript
import { validateSession } from "../utils/sessionHandler";
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  
  const performSensitiveAction = async () => {
    // Check session before proceeding
    const isValid = await validateSession(navigate);
    
    if (!isValid) {
      // User will be redirected to login
      return;
    }
    
    // Proceed with action...
  };
}
```

## Configuration

### Adjust Session Check Interval
Default is 5 minutes (300,000ms). To change:

```javascript
// Check every 10 minutes instead
const cleanup = startSessionMonitoring(navigate, 10 * 60 * 1000);
```

### Customize Expiration Messages
```javascript
import { handleSessionExpiration } from "../utils/sessionHandler";

// Custom message
handleSessionExpiration(
  navigate, 
  "Your session timed out due to inactivity. Please log in again."
);
```

## Testing Session Expiration

### Manual Testing Steps
1. Sign in to the application
2. Open browser DevTools > Application > Cookies
3. Delete the session cookie (usually named `session` or similar)
4. Try to send a chat message or perform any authenticated action
5. Should automatically redirect to login with expiration message

### Backend Testing
Your backend should return:
- **401 Unauthorized** when session is invalid/expired
- **403 Forbidden** when user lacks permissions

## Security Considerations

### Data Cleanup
When session expires, the following are cleared:
- `localStorage.userEmail`
- `localStorage.userName`
- `localStorage.userPicture`
- `localStorage.token`
- All chat history caches (`*chat_history*`)

### Credentials
All requests include `credentials: 'include'` to ensure cookies are sent with cross-origin requests.

### Navigation
Uses `navigate(..., { replace: true })` to prevent users from using browser back button to return to authenticated pages after logout.

## Troubleshooting

### Session expiration not detected
- Verify backend returns proper 401/403 status codes
- Check that `credentials: 'include'` is set in fetch options
- Ensure CORS configuration allows credentials

### Monitoring interval not working
- Check that cleanup function is called on component unmount
- Verify navigate function is passed correctly
- Check browser console for errors

### Messages not displaying
- Verify AuthPage component is receiving location.state
- Check that navigation includes state parameter
- Ensure message timeout (8 seconds) hasn't already passed

## Future Enhancements

Potential improvements:
- Session timeout warning (e.g., "Your session will expire in 2 minutes")
- Refresh token mechanism for seamless re-authentication
- Persist user activity across tabs
- Configurable session duration per user role
- Session analytics/monitoring dashboard

## Related Files
- `src/utils/sessionHandler.js` - Core session utilities
- `src/utils/auth.js` - Legacy auth utilities (uses sessionHandler)
- `src/pages/AuthPage.jsx` - Login page with expiration notifications
- `src/pages/MentorMateHomePage.jsx` - Homepage with session monitoring
- All `src/pages/*Chat.jsx` - Chat pages with session handling
