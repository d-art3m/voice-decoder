import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Voice Decoder Unlimited",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[STRIPE_CHECKOUT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 