import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "info" | "muted" | "primary";

const STYLES: Record<Tone, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/20 text-warning-foreground border-warning/40",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
};

const MAP: Record<string, Tone> = {
  // production
  Running: "success", "In Progress": "info", Completed: "success", Queued: "muted",
  Delayed: "destructive", Down: "destructive", Idle: "warning", Maintenance: "warning",
  // orders / payment
  Confirmed: "info", Dispatched: "info", Delivered: "success", Quotation: "muted",
  Paid: "success", Pending: "warning", Partial: "info", Overdue: "destructive",
  // customer / employee / severity
  Active: "success", "On Hold": "warning", Inactive: "muted",
  Present: "success", "On Leave": "warning", Absent: "destructive",
  Minor: "muted", Major: "warning", Critical: "destructive",
};

export function StatusPill({ value }: { value: string }) {
  const tone = MAP[value] ?? "primary";
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
      STYLES[tone],
    )}>
      {value}
    </span>
  );
}
