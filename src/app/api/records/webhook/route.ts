import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "../../../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
    console.log("[STRIPE_WEBHOOK] Event received:", event.type);
  } catch (err) {
    console.error("[STRIPE_WEBHOOK] Error constructing event:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    console.log("[STRIPE_WEBHOOK] Checkout session completed. userId:", userId);
    if (userId) {
      try {
        await prisma.user.update({
          where: { clerkUserId: userId },
          data: { isPaid: true },
        });
        console.log("[STRIPE_WEBHOOK] User updated to isPaid: true for userId:", userId);
      } catch (dbError) {
        console.error("[STRIPE_WEBHOOK] Database update error:", dbError);
      }
    }
  }

  return new NextResponse("ok");
} 