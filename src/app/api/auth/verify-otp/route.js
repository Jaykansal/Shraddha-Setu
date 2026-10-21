import { NextResponse } from 'next/server';
import { serverStore, normalizePhone } from '@/lib/serverStore';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, otp, role = 'CLIENT', name = '', city = 'Varanasi' } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'कृपया मोबाइल नंबर और 6-अंकों का ओटीपी दर्ज करें (Phone number and OTP are required).' },
        { status: 400 }
      );
    }

    const cleanDigits = normalizePhone(phone);
    const cleanOtp = String(otp).trim();

    // Verify OTP
    const isValid = serverStore.verifyOtp(cleanDigits, cleanOtp);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'अमान्य अथवा समाप्त ओटीपी कोड (Invalid or expired OTP code. Use 108108 for demo testing).' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = serverStore.findUserByPhone(cleanDigits);

    if (!user) {
      if (role === 'CLIENT') {
        // Auto-create new devotee account seamlessly on successful OTP verification!
        const defaultName = name && name.trim() ? name.trim() : `Yajman (${cleanDigits.slice(-4)})`;
        user = serverStore.createUser({
          name: defaultName,
          email: `devotee_${cleanDigits}@shraddhasetu.com`,
          phone: `+91 ${cleanDigits}`,
          password: 'otp_verified',
          role: 'CLIENT',
          city: city || 'Varanasi',
          isVerified: true,
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: `इस नंबर पर कोई ${role === 'PANDIT' ? 'आचार्य' : 'प्रशासक'} खाता पंजीकृत नहीं है।`
          },
          { status: 404 }
        );
      }
    }

    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: `नमस्ते, ${safeUser.name}! ओटीपी सत्यापन सफल रहा (OTP verified successfully).`,
      token: `jwt_${safeUser.role}_${Date.now()}`,
      user: safeUser,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'OTP सत्यापन में त्रुटि (Server error during OTP verification)' },
      { status: 500 }
    );
  }
}
