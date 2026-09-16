import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { incrementCouponUsage } from "@/lib/coupons";
import { DEFAULT_MARKET, getMarket, isValidMarket } from "@/lib/markets";
import { createOrderNotification } from "@/lib/orders";
import { computeOrderTotalsAsync, convertFromINR } from "@/lib/pricing";
import { getProductById } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";
import { getUserPrimeStatus } from "@/lib/users";
import { checkoutSchema } from "@/lib/validators";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in before checkout." }, { status: 401 });
  }

  const payload = checkoutSchema.parse(await request.json());
  const productIds = payload.items.map((item) => item.productId);

  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  const catalogProducts =
    dbProducts.length > 0
      ? dbProducts
      : (
          await Promise.all(payload.items.map((item) => getProductById(item.productId)))
        ).filter((product): product is NonNullable<typeof product> => Boolean(product));

  const orderItems = payload.items.map((item) => {
    const product = catalogProducts.find((entry) => entry.id === item.productId);

    if (!product) {
      throw new Error("Product no longer exists.");
    }

    if ("stock" in product && product.stock < item.quantity) {
      throw new Error(`${product.title} is out of stock.`);
    }

    return {
      product,
      quantity: item.quantity
    };
  });

  const subtotalINR = orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const marketCode = payload.market && isValidMarket(payload.market) ? payload.market : DEFAULT_MARKET;
  const market = getMarket(marketCode);
  const isPrime = await getUserPrimeStatus(session.user.id);
  const deliveryMethod = payload.deliveryMethod ?? "standard";

  const totals = await computeOrderTotalsAsync({
    subtotalINR,
    marketCode,
    isPrime,
    deliveryMethod,
    couponCode: payload.couponCode
  });

  const { subtotal, shipping, tax, couponDiscount, total } = totals;
  const discountRatio = subtotal > 0 ? couponDiscount / subtotal : 0;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      subtotal,
      shipping,
      tax,
      discount: couponDiscount,
      total,
      couponCode: payload.couponCode?.toUpperCase() || null,
      deliveryMethod,
      shippingFullName: payload.address.fullName,
      shippingPhone: payload.address.phone,
      shippingLine1: payload.address.line1,
      shippingLine2: payload.address.line2,
      shippingCity: payload.address.city,
      shippingState: payload.address.state,
      shippingPincode: payload.address.pincode,
      shippingCountry: market.name,
      items: {
        create: orderItems.map(({ product, quantity }) => ({
          productId: product.id,
          title: product.title,
          image: product.images[0],
          price: product.price,
          quantity
        }))
      },
      timeline: {
        create: {
          status: "PENDING",
          message: "Order placed — awaiting payment"
        }
      }
    }
  });

  const lineItems = orderItems.map(({ product, quantity }) => {
    const unitLocal = convertFromINR(product.price, marketCode);
    const discountedUnit = Math.max(0, unitLocal * (1 - discountRatio));
    return {
      quantity,
      price_data: {
        currency: market.stripeCurrency,
        unit_amount: Math.max(1, Math.round(discountedUnit * 100)),
        product_data: {
          name: product.title,
          images: [product.images[0]]
        }
      }
    };
  });

  if (shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: market.stripeCurrency,
        unit_amount: Math.round(shipping * 100),
        product_data: { name: "Shipping", images: [] }
      }
    });
  }

  if (tax > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: market.stripeCurrency,
        unit_amount: Math.round(tax * 100),
        product_data: { name: market.tax.label, images: [] }
      }
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: session.user.email ?? undefined,
    line_items: lineItems,
    success_url: absoluteUrl(`/checkout/success?orderId=${order.id}`),
    cancel_url: absoluteUrl("/cart"),
    metadata: {
      orderId: order.id,
      userId: session.user.id
    }
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSession: checkout.id }
  });

  if (payload.couponCode && couponDiscount > 0) {
    await incrementCouponUsage(payload.couponCode);
  }

  await createOrderNotification(
    session.user.id,
    "Order placed",
    `Your order #${order.id.slice(-8).toUpperCase()} is awaiting payment.`,
    `/dashboard/orders/${order.id}`
  );

  return NextResponse.json({ url: checkout.url, orderId: order.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Invalid checkout data." },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
