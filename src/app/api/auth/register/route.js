import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, phone, password, role = 'CLIENT', city, gurukul, specialization, experience } = body;

    if (!name || !email || !phone || !password || !city) {
      return NextResponse.json(
        { success: false, message: 'Please provide Name, Email, Phone, Password, and City.' },
        { status: 400 }
      );
    }

    const cleanRole = role.toUpperCase();
    const user = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone,
      role: cleanRole,
      city,
      gurukul: gurukul || '',
      vedicSpecialization: specialization || '',
      experienceYears: Number(experience) || 0,
      isVerified: cleanRole === 'PANDIT' ? false : true,
      rating: 5.0,
      poojasConducted: 0
    };

    return NextResponse.json({
      success: true,
      message: `${cleanRole === 'PANDIT' ? 'Vedic Pandit' : 'Devotee'} registered successfully!`,
      token: 'jwt_' + cleanRole + '_' + Date.now(),
      user,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error during registration' },
      { status: 500 }
    );
  }
}
