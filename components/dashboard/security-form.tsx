"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to update password");
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid max-w-md gap-3">
      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="h-10 rounded border px-3 dark:border-white/10 dark:bg-slate-950"
        required
      />
      <input
        type="password"
        placeholder="New password"
        minLength={6}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="h-10 rounded border px-3 dark:border-white/10 dark:bg-slate-950"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
