import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number; // %, positive = up
  deltaLabel?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "destructive" | "info";
}

const toneStyles: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  destructive: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

export function KpiCard({ label, value, delta, deltaLabel, icon: Icon, tone = "default" }: KpiCardProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
            <div className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</div>
            {delta !== undefined && (
              <div className={cn("mt-1.5 flex items-center gap-1 text-xs font-medium", up ? "text-success" : "text-destructive")}>
                {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(delta).toFixed(1)}%
                {deltaLabel && <span className="text-muted-foreground font-normal ml-1">{deltaLabel}</span>}
              </div>
            )}
          </div>
          <div className={cn("h-10 w-10 rounded-md flex items-center justify-center", toneStyles[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
