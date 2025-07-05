import { generateToken, verifyToken, getUserById } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validate required fields
    if (!refreshToken) {
      return new Response(
        JSON.stringify({
          error: 'Missing refresh token',
          message: 'Refresh token is required'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify refresh token
    const { userId, type } = verifyToken(refreshToken);

    if (type !== 'refresh') {
      return new Response(
        JSON.stringify({
          error: 'Invalid token type',
          message: 'Token is not a refresh token'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user to ensure they still exist
    const user = await getUserById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({
          error: 'User not found',
          message: 'User associated with this token no longer exists'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate new tokens
    const newAccessToken = generateToken(userId, 'access');
    const newRefreshToken = generateToken(userId, 'refresh');

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          token: newAccessToken,
          refreshToken: newRefreshToken
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Token refresh error:', error);

    // Handle token verification errors
    if (error.message.includes('Invalid or expired token')) {
      return new Response(
        JSON.stringify({
          error: 'Invalid refresh token',
          message: 'Refresh token is invalid or expired'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error: 'Token refresh failed',
        message: 'An error occurred while refreshing tokens. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}