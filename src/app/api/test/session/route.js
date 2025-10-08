import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get the session to see if user is authenticated
    const session = await getServerSession(authOptions);

    console.log('🔍 Test API - Session check:', {
      hasSession: !!session,
      sessionKeys: session ? Object.keys(session) : [],
      user: session?.user ? {
        name: session.user.name,
        email: session.user.email,
        hasRestKey: !!session.user.rest_key,
        hasEmbedToken: !!session.user.embed_token,
        userId: session.user.user_id,
        siteId: session.user.site_id
      } : null
    });

    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Test API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
