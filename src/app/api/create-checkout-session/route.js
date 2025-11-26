import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { items, userId, userEmail, paymentMethod } = await request.json();

    // Handle COD (Cash on Delivery) separately
    if (paymentMethod === 'cod') {
      return NextResponse.json({
        sessionId: null,
        paymentMethod: 'cod',
        success: true
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'php',
        product_data: {
          name: item.title,
          description: `From: ${item.from}`,
          images: item.images ? [item.images[0]] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to centavos
      },
      quantity: item.quantity || 1,
    }));

    // Payment method types based on user selection
    let paymentMethodTypes = ['card'];

    // Add e-wallet options for Philippine payments
    if (paymentMethod === 'gcash' || paymentMethod === 'paymaya') {
      // Note: GCash and PayMaya integration requires additional Stripe setup
      // For now, we'll use card payments. You can enable these after configuring with Stripe
      paymentMethodTypes = ['card'];
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
      customer_email: userEmail,
      metadata: {
        userId,
        items: JSON.stringify(items),
        paymentMethod,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url, // Add the checkout URL
      paymentMethod,
      success: true
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
