import { createFileRoute } from "@tanstack/react-router";
import {
  Factory, ShieldCheck, ShoppingCart, IndianRupee, Timer, PackageX,
  TrendingUp, Users,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusPill } from "@/components/status-pill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PRODUCTION_TREND, ORDERS, INVENTORY, RECENT_ACTIVITY, CUSTOMERS, formatINR, formatNum } from "@/lib/mock-data";
import { GreetingCard } from "@/components/greeting-card";
import { PredictiveMaintenance } from "@/components/predictive-maintenance";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

const ORDER_STATUS = [
  { name: "In Production", value: 5, color: "#2563eb" },
  { name: "Confirmed", value: 2, color: "#1e3a8a" },
  { name: "Dispatched", value: 1, color: "#16a34a" },
  { name: "Delivered", value: 1, color: "#f59e0b" },
  { name: "Quotation", value: 1, color: "#dc2626" },
];

function DashboardPage() {
  const totalRevenueMTD = ORDERS.reduce((s, o) => s + o.amount, 0);
  const topCustomers = [...CUSTOMERS]
    .map((c) => ({ ...c, revenue: ORDERS.filter((o) => o.customer === c.name).reduce((s, o) => s + o.amount, 0) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const lowStock = INVENTORY.filter((i) => i.stock < i.reorderLevel);

  return (
    <div className="space-y-6">
      <GreetingCard />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Production Output" value={`${formatNum(65200)} pcs`} delta={4.8} deltaLabel="vs yesterday" icon={Factory} tone="info" />
        <KpiCard label="Quality Pass Rate" value="97.3%" delta={0.6} deltaLabel="vs last week" icon={ShieldCheck} tone="success" />
        <KpiCard label="Active Orders" value="9" delta={12.5} deltaLabel="this week" icon={ShoppingCart} tone="default" />
        <KpiCard label="Revenue MTD" value={formatINR(totalRevenueMTD)} delta={-3.1} deltaLabel="vs target" icon={IndianRupee} tone="warning" />
        <KpiCard label="Total Downtime" value="7h 40m" delta={-8.2} deltaLabel="vs last week" icon={Timer} tone="destructive" />
        <KpiCard label="Inventory Alerts" value={`${lowStock.length} items`} delta={0} deltaLabel="need reorder" icon={PackageX} tone="warning" />
        <KpiCard label="Machine OEE Avg" value="72.0%" delta={2.4} deltaLabel="rolling 7d" icon={TrendingUp} tone="success" />
        <KpiCard label="Workforce Present" value="6 / 7" delta={0} deltaLabel="today" icon={Users} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Production Output vs Target</CardTitle>
            <CardDescription>Last 30 days · units per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={PRODUCTION_TREND} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={11} tick={{ fill: "#64748b" }} interval={4} />
                <YAxis fontSize={11} tick={{ fill: "#64748b" }} />
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }} />
                <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="4 4" fill="transparent" name="Target" />
                <Area type="monotone" dataKey="output" stroke="#2563eb" fill="url(#gOutput)" strokeWidth={2} name="Output" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Order Status Mix</CardTitle>
            <CardDescription>Active sales orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={ORDER_STATUS} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {ORDER_STATUS.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Customers by Revenue</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topCustomers} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" fontSize={11} tick={{ fill: "#64748b" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <YAxis type="category" dataKey="name" fontSize={11} width={140} tick={{ fill: "#64748b" }} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Low-stock Alerts</CardTitle>
            <CardDescription>{lowStock.length} items below reorder level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.map((item) => {
              const pct = Math.round((item.stock / item.reorderLevel) * 100);
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium truncate">{item.name}</span>
                    <span className="text-muted-foreground tabular-nums">{formatNum(item.stock)} {item.uom}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
            {lowStock.length === 0 && <div className="text-sm text-muted-foreground">All items above reorder level.</div>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Sales Orders</CardTitle>
            <CardDescription>Live pipeline</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDERS.slice(0, 6).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="text-sm">{o.customer}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatNum(o.quantity)}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatINR(o.amount)}</TableCell>
                    <TableCell><StatusPill value={o.status} /></TableCell>
                    <TableCell><StatusPill value={o.payment} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Shop-floor & system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="flex gap-3 text-sm">
                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                  a.tone === "success" ? "bg-success" :
                  a.tone === "warning" ? "bg-warning" :
                  a.tone === "destructive" ? "bg-destructive" : "bg-info"
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="text-foreground leading-snug">{a.what}</div>
                  <div className="text-[11px] text-muted-foreground">{a.who} · {a.at}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
