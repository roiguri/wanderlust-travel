import { authenticateUser, generateToken, isValidEmail, updateUserTimestamp } from '@/lib/auth';
import { initializeDatabase } from '@/lib/database';

export async function POST(request: Request) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          message: 'Email and password are required'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid email',
          message: 'Please provide a valid email address'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Authenticate user
    const user = await authenticateUser({
      email: email.toLowerCase().trim(),
      password
    });

    // Update user's last login timestamp
    await updateUserTimestamp(user.id);

    // Generate tokens
    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            profile_picture_url: user.profile_picture_url,
            preferences: user.preferences,
            created_at: user.created_at,
            updated_at: user.updated_at
          },
          token: accessToken,
          refreshToken
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Login error:', error);

    // Handle authentication errors
    if (error.message.includes('Invalid email or password')) {
      return new Response(
        JSON.stringify({
          error: 'Authentication failed',
          message: 'Invalid email or password'
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
        error: 'Login failed',
        message: 'An error occurred during login. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}