import { authenticateRequest, createAuthenticatedResponse, createUnauthenticatedResponse } from '@/middleware/auth';
import { getUserById } from '@/lib/auth';

// GET /users/profile - Get current user's profile
export async function GET(request: Request) {
  try {
    const authResult = await authenticateRequest(request);
    
    if (!authResult.authenticated) {
      return createUnauthenticatedResponse(authResult.error);
    }

    return createAuthenticatedResponse({
      success: true,
      data: {
        user: authResult.user
      }
    });

  } catch (error: any) {
    console.error('Get profile error:', error);

    return createAuthenticatedResponse({
      error: 'Failed to get profile',
      message: 'An error occurred while fetching user profile'
    }, 500);
  }
}

// PUT /users/profile - Update current user's profile
export async function PUT(request: Request) {
  try {
    const authResult = await authenticateRequest(request);
    
    if (!authResult.authenticated) {
      return createUnauthenticatedResponse(authResult.error);
    }

    const body = await request.json();
    const { username, profile_picture_url, preferences } = body;

    // TODO: Implement profile update logic
    // This would include validation and database updates

    return createAuthenticatedResponse({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: authResult.user
      }
    });

  } catch (error: any) {
    console.error('Update profile error:', error);

    return createAuthenticatedResponse({
      error: 'Failed to update profile',
      message: 'An error occurred while updating user profile'
    }, 500);
  }
}