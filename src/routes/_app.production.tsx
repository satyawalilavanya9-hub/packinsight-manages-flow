import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/status-pill";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MACHINES, JOBS, DOWNTIME, formatNum } from "@/lib/mock-data";
import { Factory, Search, Plus } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/production")({
  head: () => ({ meta: [{ title: "Production — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: ProductionPage,
});

const SHIFT_OUTPUT = [
  { shift: "Shift A (6-14)", output: 28400, target: 30000 },
  { shift: "Shift B (14-22)", output: 24100, target: 28000 },
  { shift: "Shift C (22-6)", output: 12700, target: 18000 },
];

function ProductionPage() {
  const [q, setQ] = useState("");
  const filteredJobs = JOBS.filter((j) =>
    !q || j.id.toLowerCase().includes(q.toLowerCase()) || j.customer.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Factory className="h-4 w-4" /> Machine Status</CardTitle>
            <CardDescription>Live shop floor</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {MACHINES.map((m) => (
              <div key={m.id} className="rounded-md border border-border p-3 bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">{m.type} · {m.operator}</div>
                  </div>
                  <StatusPill value={m.status} />
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Output today</span>
                    <span className="tabular-nums">{formatNum(m.outputToday)} / {formatNum(m.target)}</span>
                  </div>
                  <Progress value={(m.outputToday / m.target) * 100} className="h-1.5" />
                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-muted-foreground">OEE</span>
                    <span className={`font-medium tabular-nums ${m.oee >= 80 ? "text-success" : m.oee >= 65 ? "text-warning-foreground" : "text-destructive"}`}>{m.oee}%</span>
                  </div>
                  {m.currentJob && <Badge variant="secondary" className="text-[10px] font-mono">{m.currentJob}</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Shift-wise Output</CardTitle>
            <CardDescription>Today · units produced</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={SHIFT_OUTPUT} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="shift" fontSize={10} tick={{ fill: "#64748b" }} />
                <YAxis fontSize={11} tick={{ fill: "#64748b" }} />
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="target" fill="#f1f5f9" radius={[4,4,0,0]} />
                <Bar dataKey="output" fill="#1e3a8a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Plant OEE (avg)</span><span className="font-medium">72.0%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Availability</span><span className="font-medium">85%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Performance</span><span className="font-medium">88%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Quality</span><span className="font-medium">96%</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Production Schedule</CardTitle>
            <CardDescription>Active job cards</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search jobs…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9 w-56" />
            </div>
            <NewJobDialog />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((j) => {
                const pct = Math.round((j.produced / j.quantity) * 100);
                return (
                  <TableRow key={j.id}>
                    <TableCell className="font-mono text-xs">{j.id}</TableCell>
                    <TableCell className="text-sm">{j.customer}</TableCell>
                    <TableCell className="font-mono text-xs">{j.sku}</TableCell>
                    <TableCell className="text-xs">{j.machine}</TableCell>
                    <TableCell className="text-xs">{j.shift}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatNum(j.quantity)}</TableCell>
                    <TableCell className="min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-[11px] tabular-nums w-8 text-right">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{j.dueDate}</TableCell>
                    <TableCell><StatusPill value={j.status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Downtime Log</CardTitle>
          <CardDescription>Rolling 48 hours</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead className="text-right">Minutes</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOWNTIME.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="text-sm">{d.machine}</TableCell>
                  <TableCell className="text-sm">{d.reason}</TableCell>
                  <TableCell>{d.shift}</TableCell>
                  <TableCell className="text-right tabular-nums">{d.minutes}</TableCell>
                  <TableCell className="text-xs">{d.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NewJobDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Job</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Production Job</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Customer</Label><Input placeholder="Select customer" /></div>
            <div><Label>SKU</Label><Input placeholder="e.g. SKU-102" /></div>
            <div><Label>Quantity</Label><Input type="number" placeholder="10000" /></div>
            <div><Label>Machine</Label>
              <Select><SelectTrigger><SelectValue placeholder="Choose machine" /></SelectTrigger>
                <SelectContent>{MACHINES.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Shift</Label>
              <Select><SelectTrigger><SelectValue placeholder="A / B / C" /></SelectTrigger>
                <SelectContent><SelectItem value="A">Shift A</SelectItem><SelectItem value="B">Shift B</SelectItem><SelectItem value="C">Shift C</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Due Date</Label><Input type="date" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { toast.success("Job created"); setOpen(false); }}>Create Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
