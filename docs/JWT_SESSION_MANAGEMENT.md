# JWT Session Management Documentation

## Overview

The CraftConnect platform now implements a comprehensive JWT (JSON Web Token) based session management system alongside Firebase Authentication. This hybrid approach provides:

- **Firebase Auth**: Handles user registration, login, and profile management
- **JWT Sessions**: Provides stateless authentication for API routes and enhanced security
- **Automatic Token Refresh**: Maintains user sessions seamlessly
- **Dual Storage**: Client-side localStorage and server-side HttpOnly cookies

## Architecture

### Components

1. **JWT Utilities** (`/lib/jwt-client.ts` and `/lib/jwt-server.ts`)
   - Token generation and verification (client-side safe)
   - Session management utilities
   - Client and server-side token handling (separated for Next.js compatibility)

2. **Auth Context** (`/contexts/auth-context.tsx`)
   - Enhanced with JWT session management
   - Automatic token generation on Firebase login
   - Session state management

3. **Auth Middleware** (`/lib/auth-middleware.ts`)
   - API route protection
   - Token validation
   - Request authentication

4. **API Routes** (`/app/api/auth/`)
   - Session creation
   - Token refresh
   - Session cleanup

## Implementation Details

### Token Structure

```typescript
interface JWTPayload {
  uid: string      // Firebase user ID
  email: string    // User email
  username: string // User display name
  iat?: number     // Issued at
  exp?: number     // Expiration time
}
```

### Token Lifetimes

- **Access Token**: 15 minutes (short-lived, for API calls)
- **Refresh Token**: 7 days (long-lived, for token renewal)

### Security Features

- **HttpOnly Cookies**: Server-side tokens for enhanced security
- **Dual Storage**: Client-side tokens for API calls, server-side for SSR
- **Automatic Refresh**: Tokens refresh 5 minutes before expiry
- **Secure Flags**: Production cookies use secure, sameSite settings

## Usage Examples

### 1. Protected API Route

```typescript
// /app/api/user-data/route.ts
import { withAuth, type AuthenticatedRequest } from '@/lib/auth-middleware'

async function handler(req: AuthenticatedRequest) {
  const user = req.user! // Guaranteed to exist in protected routes
  
  return NextResponse.json({
    message: `Hello ${user.username}`,
    userId: user.uid
  })
}

export const GET = withAuth(handler)
```

### 2. Client-Side API Call

```typescript
// In a React component
import { useAuthToken } from '@/lib/auth-middleware'

function MyComponent() {
  const { getAuthHeaders } = useAuthToken()
  
  const fetchUserData = async () => {
    const headers = await getAuthHeaders()
    const response = await fetch('/api/user-data', {
      headers: headers as HeadersInit
    })
    return response.json()
  }
}
```

### 3. Using Auth Context

```typescript
// In a React component
import { useAuth } from '@/contexts/auth-context'

function SessionInfo() {
  const { 
    sessionActive, 
    accessToken, 
    refreshSession,
    user 
  } = useAuth()
  
  return (
    <div>
      <p>Session: {sessionActive ? 'Active' : 'Inactive'}</p>
      <p>User: {user?.email}</p>
      <button onClick={refreshSession}>Refresh Session</button>
    </div>
  )
}
```

## Authentication Flow

### 1. User Login
```
1. User enters credentials
2. Firebase Authentication validates
3. JWT tokens generated automatically
4. Tokens stored client-side (localStorage) and server-side (cookies)
5. Session marked as active
```

### 2. API Request
```
1. Client gets valid access token
2. Token included in Authorization header
3. Middleware validates token
4. Request processed with user context
```

### 3. Token Refresh
```
1. Access token expires (15 minutes)
2. System automatically uses refresh token
3. New access token generated
4. Session continues seamlessly
```

### 4. User Logout
```
1. User clicks logout
2. Firebase signOut() called
3. Client-side tokens cleared
4. Server-side cookies cleared
5. Session marked as inactive
```

## Security Considerations

### Environment Variables
```bash
# Required in .env.local
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-256-bits
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-minimum-256-bits
```

### Production Security Checklist

- [ ] **Strong JWT Secrets**: Use cryptographically secure random keys (256+ bits)
- [ ] **HTTPS Only**: Ensure all cookies have `secure: true` in production
- [ ] **Rotate Secrets**: Implement secret rotation for long-term security
- [ ] **Token Blacklisting**: Consider implementing token blacklisting for enhanced security
- [ ] **Rate Limiting**: Implement rate limiting on auth endpoints
- [ ] **CORS Configuration**: Properly configure CORS for API routes

## API Endpoints

### POST /api/auth/session
Creates server-side session cookies from client tokens.
```typescript
// Request body
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### POST /api/auth/refresh
Refreshes access token using refresh token.
```typescript
// Request body
{
  "refreshToken": "jwt_refresh_token"
}

// Response
{
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token",
  "expiresIn": 900000,
  "refreshExpiresIn": 604800000
}
```

### POST /api/auth/logout
Clears server-side session cookies.

### GET /api/protected
Example protected endpoint for testing JWT authentication.

## Client-Side Session Management

### ClientSessionManager Methods

```typescript
// Store tokens
ClientSessionManager.setTokens(accessToken, refreshToken, expiresIn)

// Get current access token
const token = ClientSessionManager.getAccessToken()

// Check if token is expired
const expired = ClientSessionManager.isAccessTokenExpired()

// Get valid token (refresh if needed)
const validToken = await ClientSessionManager.getValidAccessToken()

// Clear all tokens
ClientSessionManager.clearTokens()

// Refresh tokens
const success = await ClientSessionManager.refreshTokens()
```

## Debugging and Development

### Session Status Component
A debugging component is available at `/ai-dashboard` that shows:
- Current session status
- Token presence and validity
- Test protected API endpoint
- Manual session refresh

### Console Logging
The auth context logs key events:
- Auth state changes
- Profile loading
- Session generation
- Token refresh attempts

## Migration Notes

### From Firebase-Only to JWT Sessions

The implementation is backward compatible:
- Existing Firebase auth continues to work
- JWT sessions are generated automatically on login
- No changes required for existing login/signup forms
- Enhanced security and session management added transparently

### Breaking Changes
- None - this is an additive enhancement

## Troubleshooting

### Common Issues

1. **"Authentication required" on API calls**
   - Check if user is logged in
   - Verify JWT_SECRET is set in environment
   - Check token expiry

2. **Token refresh failures**
   - Verify JWT_REFRESH_SECRET is set
   - Check refresh token validity
   - Ensure /api/auth/refresh endpoint is accessible

3. **Session not persisting**
   - Check localStorage for client-side tokens
   - Verify cookies are being set server-side
   - Check HTTPS/secure flag settings in production

### Debug Steps

1. Check auth context state: `useAuth()`
2. Inspect localStorage: Look for `cc_access_token`, `cc_refresh_token`
3. Check browser cookies: Look for `access_token`, `refresh_token`
4. Test protected endpoint: Use the SessionStatus component
5. Check console logs: Auth context logs key events

## Future Enhancements

- Token blacklisting for logout/revocation
- Multi-device session management
- Session analytics and monitoring
- Advanced rate limiting
- SSO integration capabilities

---

*This JWT session management system provides enterprise-grade authentication for the CraftConnect platform while maintaining the ease of use of Firebase Authentication.*