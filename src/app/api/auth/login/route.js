import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, requestedRole = 'CLIENT' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const cleanRole = requestedRole.toUpperCase();
    let name = 'Devotee';
    if (cleanRole === 'PANDIT') {
      name = 'Acharya Vidyadhar Shastri';
    } else if (cleanRole === 'ADMIN') {
      name = 'Mandir Samiti Admin';
    } else {
      name = email.split('@')[0] || 'Rameshwar Devotee';
    }

    const user = {
      id: 'usr_' + cleanRole.toLowerCase() + '_demo',
      name: name,
      email: email,
      phone: '+91 98765 43210',
      role: cleanRole,
      city: 'Varanasi',
      gurukul: cleanRole === 'PANDIT' ? 'Sampurnanand Sanskrit University, Varanasi' : '',
      vedicSpecialization: cleanRole === 'PANDIT' ? 'Navagraha Shanti, Rudrabhishek & Griha Pravesh' : '',
      experienceYears: cleanRole === 'PANDIT' ? 18 : 0,
      isVerified: true,
      rating: 4.95,
      poojasConducted: 1420
    };

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}! Accessing ${cleanRole} Portal.`,
      token: 'jwt_' + cleanRole + '_' + Date.now(),
      user,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error during login' },
      { status: 500 }
    );
  }
}
