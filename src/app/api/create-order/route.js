import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request) {
  try {
    const {
      userId,
      userEmail,
      userName,
      items,
      totalAmount,
      paymentMethod,
      sessionId,
      shippingInfo
    } = await request.json();

    // Create order object
    const order = {
      userId,
      userEmail,
      userName,
      items,
      totalAmount,
      paymentMethod,
      stripeSessionId: sessionId || null,
      status: paymentMethod === 'cod' ? 'pending_payment' : 'paid',
      shippingInfo: shippingInfo || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save order to Firestore
    const orderRef = await addDoc(collection(db, 'orders'), order);

    // TODO: Send confirmation email
    // TODO: Notify seller

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
