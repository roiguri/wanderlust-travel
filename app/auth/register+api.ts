import { supabase } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
          display_name: username || email.split('@')[0],
        }
      }
    });

    if (authError) {
      console.error('Registration error:', authError);
      
      // Check if the error is due to user already existing
      if (authError.message?.includes('User already registered') || 
          authError.message?.includes('already been registered') ||
          authError.status === 422) {
        return new Response(
          JSON.stringify({ error: 'User already exists' }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'An error occurred during registration. Please try again.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
         username: authData.user?.user_metadata?.username || email.split('@')[0],
          profile_picture_url: authData.user?.user_metadata?.profile_picture_url,
          preferences: {},
          created_at: authData.user?.created_at || new Date().toISOString(),
          updated_at: authData.user?.updated_at || new Date().toISOString(),
        },
        token: authData.session?.access_token || '',
        refreshToken: authData.session?.refresh_token || '',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred during registration. Please try again.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}