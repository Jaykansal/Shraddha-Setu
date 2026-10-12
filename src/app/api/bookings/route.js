import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { POOJA_SERVICES } from '@/data/poojas';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'CLIENT' or 'PANDIT'
    const city = searchParams.get('city');

    const db = await connectToDatabase();
    if (db) {
      let query = {};
      if (city) query['venueAddress.city'] = new RegExp(city, 'i');
      const bookings = await Booking.find(query).sort({ createdAt: -1 }).limit(20);
      return NextResponse.json({ success: true, count: bookings.length, data: bookings });
    }

    return NextResponse.json({
      success: true,
      message: 'Running in mock mode. MongoDB URI not provided.',
      data: []
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientPhone,
      clientEmail,
      poojaId,
      withSamagri = true, // Boolean option requested by user
      bookingDate,
      city,
      occasion,
      specialNotes,
    } = body;

    if (!clientName || !clientPhone || !poojaId || !city) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields: Name, Phone, Pooja, and City.' },
        { status: 400 }
      );
    }

    // Find pooja from master data to verify prices
    const pooja = POOJA_SERVICES.find(p => p.id === poojaId || p.title.toLowerCase() === poojaId.toLowerCase()) 
      || POOJA_SERVICES[0];

    const basePrice = pooja.priceWithoutSamagri || 1500;
    const samagriPrice = withSamagri ? (pooja.samagriCost || 600) : 0;
    const totalAmount = basePrice + samagriPrice;

    const db = await connectToDatabase();
    let savedBooking = null;

    if (db) {
      savedBooking = await Booking.create({
        clientName,
        clientPhone,
        clientEmail: clientEmail || '',
        poojaId: pooja.id,
        poojaTitle: pooja.title,
        occasion: occasion || 'Devotional Puja',
        withSamagri,
        basePrice,
        samagriPrice,
        totalAmount,
        bookingDate: bookingDate ? new Date(bookingDate) : new Date(Date.now() + 86400000 * 3),
        venueAddress: { city },
        specialSankalpNotes: specialNotes || '',
        status: 'CONFIRMED',
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Pooja booking confirmed successfully (${withSamagri ? 'With Pure Samagri Kit' : 'Pandit Only - Without Samagri'}).`,
        booking: savedBooking || {
          id: 'BKG_' + Date.now(),
          clientName,
          poojaTitle: pooja.title,
          withSamagri,
          basePrice,
          samagriPrice,
          totalAmount,
          bookingDate,
          city,
          status: 'CONFIRMED'
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
