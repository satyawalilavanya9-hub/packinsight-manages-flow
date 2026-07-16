import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusPill } from "@/components/status-pill";
import { KpiCard } from "@/components/kpi-card";
import { Checkbox } from "@/components/ui/checkbox";
import { DEFECTS, DEFECT_PARETO, formatNum } from "@/lib/mock-data";
import { ShieldCheck, XCircle, AlertTriangle, ClipboardCheck } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/_app/quality")({
  head: () => ({ meta: [{ title: "Quality Control — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: QualityPage,
});

const STAGE_REJECT = [
  { stage: "Corrugation", count: 225, color: "var(--color-chart-1)" },
  { stage: "Printing", count: 685, color: "var(--color-chart-2)" },
  { stage: "Die-Cutting", count: 152, color: "var(--color-chart-3)" },
  { stage: "Gluing", count: 310, color: "var(--color-chart-4)" },
  { stage: "Packing", count: 78, color: "var(--color-chart-5)" },
];

const CHECKLIST = [
  { id: 1, item: "Reel splicing joints checked (Corrugator A/B)", done: true },
  { id: 2, item: "Adhesive gel-point measured (Line A)", done: true },
  { id: 3, item: "Print registration verified — 4-color job", done: true },
  { id: 4, item: "Compression strength test on FG-105", done: false },
  { id: 5, item: "GSM cross-check on Kraft Liner 180", done: false },
  { id: 6, item: "Barcode scan test on 5 sample cartons", done: true },
];

function QualityPage() {
  const totalDefects = DEFECTS.reduce((s, d) => s + d.quantity, 0);
  const critical = DEFECTS.filter((d) => d.severity === "Critical").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Pass Rate" value="97.3%" delta={0.6} icon={ShieldCheck} tone="success" />
        <KpiCard label="Total Rejections" value={formatNum(totalDefects)} delta={-5.4} deltaLabel="vs last week" icon={XCircle} tone="destructive" />
        <KpiCard label="Critical NCRs" value={String(critical)} delta={0} deltaLabel="open" icon={AlertTriangle} tone="warning" />
        <KpiCard label="QA Audits Done" value="18 / 22" delta={9.2} icon={ClipboardCheck} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Defect Pareto</CardTitle>
            <CardDescription>Top defect types this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DEFECT_PARETO} margin={{ left: -10, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="type" fontSize={10} tick={{ fill: "var(--color-muted-foreground)" }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis fontSize={11} tick={{ fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Bar dataKey="count" fill="var(--color-chart-5)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Rejection by Stage</CardTitle>
            <CardDescription>Production step contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={STAGE_REJECT} dataKey="count" nameKey="stage" innerRadius={45} outerRadius={85}>
                  {STAGE_REJECT.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Non-Conformance Reports (NCR)</CardTitle>
            <CardDescription>Latest defect logs</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NCR</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Defect</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reported</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEFECTS.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="text-xs">{d.date}</TableCell>
                    <TableCell className="font-mono text-xs">{d.sku}</TableCell>
                    <TableCell className="text-sm">{d.stage}</TableCell>
                    <TableCell className="text-sm">{d.type}</TableCell>
                    <TableCell className="text-right tabular-nums">{d.quantity}</TableCell>
                    <TableCell><StatusPill value={d.severity} /></TableCell>
                    <TableCell className="text-xs">{d.reportedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Shift-A QA Checklist</CardTitle>
            <CardDescription>Today · {CHECKLIST.filter(c => c.done).length}/{CHECKLIST.length} complete</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {CHECKLIST.map((c) => (
              <div key={c.id} className="flex items-start gap-3 text-sm">
                <Checkbox checked={c.done} className="mt-0.5" />
                <span className={c.done ? "text-muted-foreground line-through" : "text-foreground"}>{c.item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
