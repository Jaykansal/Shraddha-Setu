import { NextResponse } from 'next/server';
import { POOJA_SERVICES } from '@/data/poojas';

export async function GET(request) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Bookings list',
      data: []
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { clientName, clientPhone, clientEmail, poojaId, withSamagri = true, bookingDate, city, occasion, specialNotes } = body;

    if (!clientName || !clientPhone || !poojaId || !city) {
      return NextResponse.json(
        { success: false, message: 'Please provide Name, Phone, Pooja, and City.' },
        { status: 400 }
      );
    }

    const pooja = POOJA_SERVICES.find(p => p.id === poojaId || p.title.toLowerCase() === poojaId.toLowerCase()) || POOJA_SERVICES[0];
    const basePrice = pooja.priceWithoutSamagri || 1500;
    const samagriPrice = withSamagri ? (pooja.samagriCost || 600) : 0;
    const totalAmount = basePrice + samagriPrice;

    const booking = {
      id: 'bkg_' + Date.now(),
      bookingCode: 'SS-' + Math.floor(1000 + Math.random() * 9000),
      clientName,
      clientPhone,
      clientEmail: clientEmail || '',
      poojaId: pooja.id,
      poojaTitle: pooja.title,
      withSamagri,
      basePrice,
      samagriPrice,
      totalAmount,
      bookingDate: bookingDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      timeSlot: 'Morning Auspicious Muhurat (09:00 AM)',
      city,
      occasion: occasion || 'Devotional Puja',
      specialNotes: specialNotes || '',
      status: 'CONFIRMED',
      assignedPanditId: '',
      assignedPanditName: '',
      assignedPanditPhone: '',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Pooja booking confirmed successfully (${withSamagri ? 'With Pure Samagri Kit' : 'Pandit Only'})!`,
      booking
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
