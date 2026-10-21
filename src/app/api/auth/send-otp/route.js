import { NextResponse } from 'next/server';
import { serverStore, normalizePhone } from '@/lib/serverStore';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, role = 'CLIENT' } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें (Please provide a valid 10-digit mobile number).' },
        { status: 400 }
      );
    }

    const cleanDigits = normalizePhone(phone);
    if (cleanDigits.length < 10) {
      return NextResponse.json(
        { success: false, message: 'कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit mobile number).' },
        { status: 400 }
      );
    }

    // Role-specific check if user must exist first
    if (role === 'PANDIT') {
      const existing = serverStore.findUserByPhone(cleanDigits);
      if (!existing || existing.role !== 'PANDIT') {
        return NextResponse.json(
          {
            success: false,
            message: 'यह मोबाइल नंबर आचार्य / पंडित के रूप में पंजीकृत नहीं है। कृपया पहले नया पंजीकरण (Registration) करें।'
          },
          { status: 404 }
        );
      }
    } else if (role === 'ADMIN') {
      const existing = serverStore.findUserByPhone(cleanDigits);
      if (!existing || existing.role !== 'ADMIN') {
        return NextResponse.json(
          {
            success: false,
            message: 'यह मोबाइल नंबर मंदिर समिति व्यवस्थापक (Admin) के रूप में पंजीकृत नहीं है।'
          },
          { status: 404 }
        );
      }
    }

    // Generate 6-digit OTP code (Sacred 108108 for instant testability)
    const generatedOtp = '108108';
    serverStore.storeOtp(cleanDigits, generatedOtp, role);

    return NextResponse.json({
      success: true,
      message: `सत्यापन कोड (OTP) आपके मोबाइल नंबर +91 ${cleanDigits} पर भेज दिया गया है। (डेमो कोड: ${generatedOtp})`,
      phone: cleanDigits,
      demoOtp: generatedOtp,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || 'OTP भेजने में त्रुटि हुई (Server error sending OTP)' },
      { status: 500 }
    );
  }
}
