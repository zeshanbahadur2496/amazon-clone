"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SecurityForm } from "@/components/dashboard/security-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SecurityPage() {
  async function sendVerification() {
    const res = await fetch("/api/auth/verify-email", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message, { description: data.verifyUrl });
    } else {
      toast.error(data.message ?? "Failed to send verification");
    }
  }

  return (
    <DashboardShell title="Login & Security">
      <div className="space-y-4">
        <div className="amazon-card">
          <h2 className="font-bold">Change password</h2>
          <SecurityForm />
        </div>
        <div className="amazon-card">
          <h2 className="font-bold">Email verification</h2>
          <p className="mt-2 text-sm text-slate-600">Verify your email address for account security.</p>
          <Button variant="outline" className="mt-4" onClick={sendVerification}>
            Send verification email
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
