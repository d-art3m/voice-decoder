import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRODUCT_NAME = "Voice Decoder Unlimited";
const PRODUCT_UNIT_AMOUNT = 500;
const PRODUCT_CURRENCY = "usd";
const PRODUCT_QUANTITY = 1;

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
            currency: PRODUCT_CURRENCY,
            product_data: {
              name: PRODUCT_NAME,
            },
            unit_amount: PRODUCT_UNIT_AMOUNT,
          },
          quantity: PRODUCT_QUANTITY,
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
    return new NextResponse("Internal Error", { status: 500 });
  }
} 