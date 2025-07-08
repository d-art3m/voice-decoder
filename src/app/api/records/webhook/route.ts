import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from '@lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const EVENT_CHECKOUT_SESSION_COMPLETED = "checkout.session.completed";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === EVENT_CHECKOUT_SESSION_COMPLETED) {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      try {
        await prisma.user.update({
          where: { clerkUserId: userId },
          data: { isPaid: true },
        });
      } catch (dbError) {}
    }
  }

  return new NextResponse("ok");
} 