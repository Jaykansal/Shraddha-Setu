import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, requestedRole } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = serverStore.findUserByEmail(cleanEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No registered account found with this email. Please register first.' },
        { status: 404 }
      );
    }

    // Password verification
    if (user.password && user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    // Role verification
    if (requestedRole && user.role.toUpperCase() !== requestedRole.toUpperCase()) {
      const portalName = user.role === 'PANDIT' ? 'Pandit / Acharya' : (user.role === 'ADMIN' ? 'Mandir Admin' : 'Devotee');
      return NextResponse.json(
        {
          success: false,
          message: `This account is registered under the ${portalName} role. Please switch to the ${portalName} tab to sign in.`
        },
        { status: 403 }
      );
    }

    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: `Namaste, ${safeUser.name}! Successfully signed in.`,
      token: `jwt_${safeUser.role}_${Date.now()}`,
      user: safeUser,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error during login' },
      { status: 500 }
    );
  }
}
