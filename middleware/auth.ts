import { verifyToken, getUserById } from '@/lib/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    profile_picture_url?: string;
    preferences: Record<string, any>;
    created_at: string;
    updated_at: string;
  };
}

// Middleware to authenticate requests
export async function authenticateRequest(request: Request): Promise<{
  authenticated: boolean;
  user?: any;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Missing or invalid authorization header'
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const { userId, type } = verifyToken(token);

    if (type !== 'access') {
      return {
        authenticated: false,
        error: 'Invalid token type'
      };
    }

    // Get user
    const user = await getUserById(userId);
    if (!user) {
      return {
        authenticated: false,
        error: 'User not found'
      };
    }

    return {
      authenticated: true,
      user
    };

  } catch (error: any) {
    return {
      authenticated: false,
      error: error.message || 'Authentication failed'
    };
  }
}

// Helper function to create authenticated API responses
export function createAuthenticatedResponse(
  data: any,
  status: number = 200
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Helper function to create unauthenticated error responses
export function createUnauthenticatedResponse(message: string = 'Authentication required'): Response {
  return new Response(
    JSON.stringify({
      error: 'Unauthorized',
      message
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}