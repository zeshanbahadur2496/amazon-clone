import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const PRIME_PRICE_ID = process.env.STRIPE_PRIME_PRICE_ID;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ message: "Sign in required" }, { status: 401 });
  }

  if (!PRIME_PRICE_ID) {
    return NextResponse.json(
      { message: "Prime subscription is not configured. Set STRIPE_PRIME_PRICE_ID in .env" },
      { status: 503 }
    );
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: session.user.email,
    line_items: [{ price: PRIME_PRICE_ID, quantity: 1 }],
    success_url: absoluteUrl("/dashboard/prime?subscribed=1"),
    cancel_url: absoluteUrl("/prime"),
    metadata: { userId: session.user.id },
    subscription_data: {
      metadata: { userId: session.user.id }
    }
  });

  return NextResponse.json({ url: checkout.url });
}
