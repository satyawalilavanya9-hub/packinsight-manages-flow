import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import { StatusPill } from "@/components/status-pill";
import { ShoppingCart, IndianRupee, FileText, Clock, Search, Plus, Download } from "lucide-react";
import { ORDERS, REVENUE_TREND, formatINR, formatNum } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/sales")({
  head: () => ({ meta: [{ title: "Sales — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: SalesPage,
});

function SalesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = ORDERS.filter((o) =>
    (status === "all" || o.status === status) &&
    (!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase()))
  );

  const total = ORDERS.reduce((s, o) => s + o.amount, 0);
  const overdue = ORDERS.filter(o => o.payment === "Overdue").reduce((s, o) => s + o.amount, 0);
  const quotations = ORDERS.filter(o => o.status === "Quotation").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="MTD Revenue" value={formatINR(total)} delta={-3.1} deltaLabel="vs target" icon={IndianRupee} tone="info" />
        <KpiCard label="Open Orders" value={String(ORDERS.filter(o => o.status !== "Delivered").length)} delta={5} icon={ShoppingCart} tone="default" />
        <KpiCard label="Quotations" value={String(quotations)} delta={0} deltaLabel="awaiting confirmation" icon={FileText} tone="warning" />
        <KpiCard label="Overdue Payments" value={formatINR(overdue)} delta={2.3} icon={Clock} tone="destructive" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue vs target · FY26</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={REVENUE_TREND} margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" fontSize={11} tick={{ fill: "#64748b" }} />
              <YAxis fontSize={11} tick={{ fill: "#64748b" }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="5 5" name="Target" dot={false} />
              <Line type="monotone" dataKey="revenue" stroke="#1e3a8a" strokeWidth={2.5} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between pb-2">
          <div>
            <CardTitle className="text-base">Sales Orders</CardTitle>
            <CardDescription>All active & recent orders</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search order / customer…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9 w-56" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="Quotation">Quotation</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="In Production">In Production</SelectItem>
                <SelectItem value="Dispatched">Dispatched</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.success("Exported orders.csv")}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <NewOrderDialog />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="text-sm">{o.customer}</TableCell>
                  <TableCell className="font-mono text-xs">{o.sku}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNum(o.quantity)}</TableCell>
                  <TableCell className="text-right tabular-nums text-sm">{formatINR(o.amount)}</TableCell>
                  <TableCell className="text-xs">{o.orderDate}</TableCell>
                  <TableCell className="text-xs">{o.dueDate}</TableCell>
                  <TableCell><StatusPill value={o.status} /></TableCell>
                  <TableCell><StatusPill value={o.payment} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NewOrderDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Order</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Sales Order</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <div><Label>Customer</Label><Input placeholder="Search customer…" /></div>
          <div><Label>SKU</Label><Input placeholder="SKU code" /></div>
          <div><Label>Quantity</Label><Input type="number" /></div>
          <div><Label>Rate (₹)</Label><Input type="number" /></div>
          <div><Label>Order Date</Label><Input type="date" /></div>
          <div><Label>Due Date</Label><Input type="date" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => { toast.success("Sales order created"); setOpen(false); }}>Create Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
