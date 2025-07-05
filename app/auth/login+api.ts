import { supabase } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Sign in with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Login error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          username: authData.user?.user_metadata?.username || authData.user?.email?.split('@')[0] || '',
          profile_picture_url: authData.user?.user_metadata?.profile_picture_url,
          preferences: authData.user?.user_metadata?.preferences || {},
          created_at: authData.user?.created_at || new Date().toISOString(),
          updated_at: authData.user?.updated_at || new Date().toISOString(),
        },
        token: authData.session?.access_token,
        refreshToken: authData.session?.refresh_token,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during login. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}