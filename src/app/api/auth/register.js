import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role = 'CLIENT', city, panditDetails } = body;

    if (!name || !email || !phone || !password || !city) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields (Name, Email, Phone, Password, City).' },
        { status: 400 }
      );
    }

    // Connect to database if URI exists
    const db = await connectToDatabase();
    
    if (db) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'User with this email already exists.' },
          { status: 400 }
        );
      }

      const newUser = await User.create({
        name,
        email,
        phone,
        password, // In real prod, hash with bcryptjs
        role: role.toUpperCase(), // 'CLIENT' or 'PANDIT'
        city,
        panditProfile: role.toUpperCase() === 'PANDIT' ? {
          gurukul: panditDetails?.gurukul || 'Vedic Vidyapeeth',
          vedicSpecialization: panditDetails?.specialization ? [panditDetails.specialization] : ['Karmakand & Havan'],
          experienceYears: panditDetails?.experience || 5,
          languages: ['Hindi', 'Sanskrit'],
          isVerified: false,
        } : undefined,
      });

      return NextResponse.json(
        {
          success: true,
          message: role.toUpperCase() === 'PANDIT' 
            ? 'Vedic Pandit registered successfully! Profile under verification.' 
            : 'Devotee registered successfully! Welcome to ShraddhaSetu.',
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            city: newUser.city,
          }
        },
        { status: 201 }
      );
    } else {
      // In-memory fallback response when MongoDB is not connected
      return NextResponse.json(
        {
          success: true,
          message: `${role === 'PANDIT' ? 'Pandit' : 'Devotee'} registered (Mock DB Mode).`,
          user: { id: 'mock_' + Date.now(), name, email, role, city }
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error during registration.' },
      { status: 500 }
    );
  }
}
