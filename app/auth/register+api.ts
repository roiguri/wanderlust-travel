import { createUser, generateToken, isValidEmail, isValidPassword, isValidUsername } from '@/lib/auth';
import { initializeDatabase } from '@/lib/database';

export async function POST(request: Request) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const body = await request.json();
    const { email, username, password } = body;

    // Validate required fields
    if (!email || !username || !password) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          message: 'Email, username, and password are required'
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

    // Validate username
    const usernameValidation = isValidUsername(username);
    if (!usernameValidation.valid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid username',
          message: usernameValidation.message
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return new Response(
        JSON.stringify({
          error: 'Invalid password',
          message: passwordValidation.message
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create user
    const user = await createUser({
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password
    });

    // Generate tokens
    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
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
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle specific database errors
    if (error.message.includes('already exists')) {
      return new Response(
        JSON.stringify({
          error: 'User already exists',
          message: 'A user with this email or username already exists'
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error: 'Registration failed',
        message: 'An error occurred during registration. Please try again.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}