import { Check, Circle } from "lucide-react";

import type { OrderTimelineStep } from "@/types";

export function OrderTracking({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={`${step.status}-${index}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            {step.completed ? (
              <Check className="h-5 w-5 text-amazon-green" />
            ) : (
              <Circle className="h-5 w-5 text-slate-300" />
            )}
            {index < steps.length - 1 && <span className="mt-1 h-full w-px bg-slate-200 dark:bg-white/10" />}
          </div>
          <div className="pb-4">
            <p className={`font-bold ${step.completed ? "text-slate-950 dark:text-white" : "text-slate-500"}`}>
              {step.status.replaceAll("_", " ")}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{step.message}</p>
            {step.createdAt && (
              <p className="mt-1 text-xs text-slate-400">
                {new Date(step.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
