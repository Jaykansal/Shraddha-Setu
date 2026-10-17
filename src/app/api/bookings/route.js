import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { POOJA_SERVICES } from '@/data/poojas';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const panditId = searchParams.get('panditId');
    const city = searchParams.get('city');

    const bookings = serverStore.getBookings({ clientId, panditId, city });
    return NextResponse.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      clientId,
      clientName,
      clientPhone,
      clientEmail,
      poojaId,
      withSamagri = true,
      bookingDate,
      timeSlot,
      city,
      occasion,
      specialNotes
    } = body;

    if (!clientName || !clientPhone || !poojaId || !city) {
      return NextResponse.json(
        { success: false, message: 'Please provide Devotee Name, Phone, Pooja, and City.' },
        { status: 400 }
      );
    }

    const pooja = POOJA_SERVICES.find(p => p.id === poojaId || p.title.toLowerCase() === poojaId.toLowerCase()) || POOJA_SERVICES[0];
    const basePrice = pooja.priceWithoutSamagri || 1500;
    const samagriPrice = withSamagri ? (pooja.samagriCost || 600) : 0;
    const totalAmount = basePrice + samagriPrice;

    const bookingData = {
      clientId: clientId || 'usr_devotee_' + Date.now(),
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
      timeSlot: timeSlot || 'Morning Auspicious Muhurat (09:00 AM)',
      city,
      occasion: occasion || 'Vedic Devotional Puja',
      specialNotes: specialNotes || '',
    };

    const newBooking = serverStore.createBooking(bookingData);

    return NextResponse.json({
      success: true,
      message: `Pooja booking confirmed successfully (${withSamagri ? 'With Pure Samagri Kit' : 'Pandit Only'})! Reference Code: ${newBooking.bookingCode}`,
      booking: newBooking
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || 'Server error creating booking' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, bookingId, status, panditId } = body;
    const targetId = id || bookingId;

    if (!targetId || !status) {
      return NextResponse.json({ success: false, message: 'Please provide booking ID and new status' }, { status: 400 });
    }

    let pandit = null;
    if (panditId) {
      pandit = serverStore.findUserById(panditId);
    }

    const updated = serverStore.updateBookingStatus(targetId, status, pandit);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updated
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || 'Server error updating booking' }, { status: 500 });
  }
}
