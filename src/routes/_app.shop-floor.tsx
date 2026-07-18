import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/status-pill";
import { MACHINES, JOBS, RECENT_ACTIVITY, formatNum } from "@/lib/mock-data";
import { Factory, Activity, AlertTriangle, Trophy, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/shop-floor")({
  head: () => ({ meta: [{ title: "Shop-Floor Live — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: ShopFloorPage,
});

function useTicker(ms = 2000) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), ms); return () => clearInterval(id); }, [ms]);
  return tick;
}

function ShopFloorPage() {
  const tick = useTicker(2500);
  const now = new Date();

  const leaderboard = [
    { name: "Suresh Kumar", shift: "A", boxes: 18400 + (tick * 37) },
    { name: "Ramesh Yadav", shift: "A", boxes: 15200 + (tick * 30) },
    { name: "Vinod Singh", shift: "A", boxes: 12100 + (tick * 24) },
    { name: "Manoj Tiwari", shift: "B", boxes: 9600 + (tick * 18) },
  ].sort((a, b) => b.boxes - a.boxes);

  const totalOutput = MACHINES.reduce((s, m) => s + m.outputToday + (m.status === "Running" ? tick * 12 : 0), 0);
  const totalTarget = MACHINES.reduce((s, m) => s + m.target, 0);
  const running = MACHINES.filter((m) => m.status === "Running").length;
  const down = MACHINES.filter((m) => m.status === "Down").length;

  return (
    <div className="space-y-4">
      {/* Header bar — control-room feel */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-sidebar text-sidebar-foreground px-5 py-3 border border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest">Shop-Floor Live</div>
            <div className="text-[11px] opacity-70">Mannat Packaging · Ghaziabad Plant · Shift A</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div><span className="opacity-60">Time</span> <span className="font-mono font-semibold ml-1">{now.toLocaleTimeString("en-IN")}</span></div>
          <div><span className="opacity-60">Running</span> <span className="text-success font-semibold ml-1">{running}</span></div>
          <div><span className="opacity-60">Down</span> <span className="text-destructive font-semibold ml-1">{down}</span></div>
          <div><span className="opacity-60">Output</span> <span className="font-semibold ml-1 text-sidebar-primary">{formatNum(totalOutput)}</span> / {formatNum(totalTarget)}</div>
        </div>
      </div>

      {/* Machine grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {MACHINES.map((m) => {
          const live = m.outputToday + (m.status === "Running" ? tick * 12 : 0);
          const pct = Math.min(100, Math.round((live / m.target) * 100));
          const job = JOBS.find((j) => j.id === m.currentJob);
          const isRunning = m.status === "Running";
          const isDown = m.status === "Down";
          return (
            <Card key={m.id} className={`p-4 border-2 ${isDown ? "border-destructive/50 bg-destructive/5" : isRunning ? "border-success/30" : "border-border"}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Factory className="h-4 w-4 text-muted-foreground" />
                    <div className="font-semibold text-sm">{m.name}</div>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{m.id} · {m.operator}</div>
                </div>
                <StatusPill value={m.status} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Output</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {formatNum(live)}<span className="text-muted-foreground"> / {formatNum(m.target)}</span>
                  </span>
                </div>
                <Progress value={pct} className={isDown ? "opacity-40" : ""} />
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">OEE <span className="font-mono font-semibold text-foreground">{m.oee.toFixed(1)}%</span></span>
                  {job && <span className="text-primary font-mono">{job.id}</span>}
                </div>
              </div>

              {isRunning && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-[11px] text-success">
                  <Activity className="h-3 w-3 animate-pulse" /> Live · updating every 2.5s
                </div>
              )}
              {isDown && (
                <div className="mt-3 pt-3 border-t border-destructive/30 flex items-center gap-1.5 text-[11px] text-destructive font-medium">
                  <AlertTriangle className="h-3 w-3" /> Belt breakage · 145 min lost
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Leaderboard + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-primary" />
            <div className="text-sm font-semibold">Shift A Leaderboard — Live</div>
          </div>
          <div className="space-y-3">
            {leaderboard.map((op, i) => (
              <div key={op.name} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{op.name}</div>
                  <div className="text-[11px] text-muted-foreground">Shift {op.shift}</div>
                </div>
                <div className="font-mono font-semibold tabular-nums text-sm">{formatNum(op.boxes)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-sm font-semibold">Recent Activity Feed</div>
          </div>
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="flex items-start gap-2 text-xs">
                <span className="font-mono text-muted-foreground shrink-0">{a.at}</span>
                <div className="flex-1">
                  <span className="font-medium">{a.who}</span> — {a.what}
                </div>
                <Badge variant="outline" className="text-[9px] shrink-0">{a.tone}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
