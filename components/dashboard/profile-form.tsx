"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ProfileForm({
  initialName,
  initialPhone,
  email,
  role
}: {
  initialName: string;
  initialPhone: string;
  email: string;
  role: string;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to save");
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label>
        <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
        />
      </label>
      <label>
        <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Email</span>
        <input value={email} disabled className="h-11 w-full rounded-md border border-slate-200 bg-slate-100 px-3 outline-none dark:border-white/10 dark:bg-white/10" />
      </label>
      <label>
        <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Phone</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
        />
      </label>
      <label>
        <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Role</span>
        <input value={role} disabled className="h-11 w-full rounded-md border border-slate-200 bg-slate-100 px-3 outline-none dark:border-white/10 dark:bg-white/10" />
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
