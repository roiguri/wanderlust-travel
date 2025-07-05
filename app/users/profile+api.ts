import { supabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return user profile data
    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.user_metadata?.display_name || user.email?.split('@')[0] || '',
          profile_picture_url: user.user_metadata?.profile_picture_url,
          preferences: user.user_metadata?.preferences || {},
          created_at: user.created_at,
          updated_at: user.updated_at,
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching user profile' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}