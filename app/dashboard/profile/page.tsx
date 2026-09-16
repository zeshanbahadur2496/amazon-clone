import { getServerSession } from "next-auth";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <DashboardShell title="Profile">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-2xl font-black tracking-normal">Sign in to manage profile</h2>
          <Link href="/login?callbackUrl=/dashboard/profile" className="mt-5 inline-flex h-11 items-center rounded-md bg-amazon-gold px-5 text-sm font-bold text-slate-950">
            Sign in
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, phone: true, email: true, emailVerified: true }
  });

  return (
    <DashboardShell title="Profile">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        {!user?.emailVerified && (
          <p className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Email not verified. Check your inbox or request a new link from account settings.
          </p>
        )}
        <ProfileForm
          initialName={user?.name ?? ""}
          initialPhone={user?.phone ?? ""}
          email={user?.email ?? session.user.email ?? ""}
          role={session.user.role}
        />
      </div>
    </DashboardShell>
  );
}
