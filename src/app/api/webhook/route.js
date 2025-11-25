import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Find the order by sessionId and update it
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('stripeSessionId', '==', session.id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            status: 'paid',
            paymentCompleted: true,
            paidAt: new Date(),
          });
        });

        // TODO: Send confirmation email
        // TODO: Notify seller
      } catch (error) {
        console.error('Error updating order:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      // TODO: Handle failed payment
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
