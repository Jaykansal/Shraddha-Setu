import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, requestedRole = 'CLIENT' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials or user not found.' },
          { status: 401 }
        );
      }

      // Check role separation: Pandit vs Client
      if (user.role !== requestedRole.toUpperCase()) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Account is registered as ${user.role}. Please use the ${user.role === 'PANDIT' ? 'Pandit' : 'Devotee'} portal.` 
          },
          { status: 403 }
        );
      }

      // Password comparison (simple for demo, bcrypt in prod)
      if (user.password !== password) {
        return NextResponse.json(
          { success: false, message: 'Incorrect password.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Welcome back, ${user.name}! (${user.role} Portal)`,
        token: 'mock_jwt_token_' + user._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          city: user.city,
          panditProfile: user.panditProfile || null,
        }
      });
    } else {
      // Mock login for offline testing
      return NextResponse.json({
        success: true,
        message: `Logged in as ${requestedRole} (Mock Mode)`,
        token: 'mock_jwt_demo_token',
        user: {
          id: 'user_123',
          name: requestedRole === 'PANDIT' ? 'Acharya Vidyadhar Sharma' : 'Rameshwar Devotee',
          email,
          role: requestedRole,
          city: 'Varanasi',
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error during login.' },
      { status: 500 }
    );
  }
}
