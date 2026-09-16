import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OrderTracking } from "@/components/dashboard/order-tracking";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth";
import { getDefaultTimelineSteps } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { OrderTimelineStep } from "@/types";

export const dynamic = "force-dynamic";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/orders");

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: true,
      timeline: { orderBy: { createdAt: "asc" } }
    }
  });

  if (!order) notFound();

  const timelineSteps: OrderTimelineStep[] =
    order.timeline.length > 0
      ? order.timeline.map((entry) => ({
          status: entry.status,
          message: entry.message,
          createdAt: entry.createdAt.toISOString(),
          completed: true
        }))
      : getDefaultTimelineSteps(order.status).map((step) => ({
          ...step,
          createdAt: order.createdAt.toISOString()
        }));

  return (
    <DashboardShell title="Order details">
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Order ID</p>
              <p className="font-bold">{order.id}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge tone={order.status === "DELIVERED" ? "success" : "prime"}>{order.status}</Badge>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Subtotal</p>
              <p className="font-bold">{formatPrice(order.subtotal)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Shipping</p>
              <p className="font-bold">{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Tax</p>
              <p className="font-bold">{formatPrice(order.tax)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Total</p>
              <p className="font-bold text-amazon-orange">{formatPrice(order.total)}</p>
            </div>
          </div>

          {order.couponCode && order.discount > 0 && (
            <p className="mt-3 text-sm text-amazon-green">
              Coupon {order.couponCode} applied — saved {formatPrice(order.discount)}
            </p>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-bold">Items in this order</h2>
            <div className="mt-4 divide-y divide-slate-200 dark:divide-white/10">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-slate-100">
                    <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Qty {item.quantity} • {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <h2 className="text-lg font-bold">Delivery address</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {order.shippingFullName}
                <br />
                {order.shippingLine1}
                {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
                <br />
                {order.shippingCity}, {order.shippingState} {order.shippingPincode}
                <br />
                {order.shippingCountry}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <h2 className="text-lg font-bold">Track package</h2>
              <div className="mt-4">
                <OrderTracking steps={timelineSteps} />
              </div>
            </div>
          </div>
        </div>

        <Link href="/dashboard/orders" className="inline-flex text-sm font-bold text-amazon-teal hover:underline">
          ← Back to orders
        </Link>
      </div>
    </DashboardShell>
  );
}
