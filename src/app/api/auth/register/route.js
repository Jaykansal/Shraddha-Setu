import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      password,
      role = 'CLIENT',
      city,
      gurukul,
      specialization,
      experience
    } = body;

    if (!name || !email || !phone || !password || !city) {
      return NextResponse.json(
        { success: false, message: 'Please provide Name, Email, Phone, Password, and City.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = serverStore.findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const cleanRole = role.toUpperCase();
    const newUserData = {
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      role: cleanRole,
      city: city.trim(),
      gurukul: cleanRole === 'PANDIT' ? (gurukul || 'Kashi Veda Vidyapeeth, Varanasi') : '',
      vedicSpecialization: cleanRole === 'PANDIT' ? (specialization || 'Karmakand, Havan & Vedic Anushthan') : '',
      experienceYears: cleanRole === 'PANDIT' ? (Number(experience) || 5) : 0,
      languages: ['Hindi', 'Sanskrit'],
    };

    const createdUser = serverStore.createUser(newUserData);
    const { password: _, ...safeUser } = createdUser;

    const welcomeMsg = cleanRole === 'PANDIT'
      ? 'Vedic Pandit registered successfully! Your Acharya profile is now active.'
      : 'Devotee account registered successfully! Welcome to ShraddhaSetu.';

    return NextResponse.json({
      success: true,
      message: welcomeMsg,
      token: `jwt_${cleanRole}_${Date.now()}`,
      user: safeUser,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error during registration' },
      { status: 500 }
    );
  }
}
