import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";
import { StatusPill } from "@/components/status-pill";
import { Users, Building2, TrendingUp, AlertCircle, Search, Plus, Download } from "lucide-react";
import { CUSTOMERS, formatINR } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers")({
  head: () => ({ meta: [{ title: "Customers — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const [q, setQ] = useState("");
  const [ind, setInd] = useState("all");
  const filtered = CUSTOMERS.filter(c =>
    (ind === "all" || c.industry === ind) &&
    (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.contact.toLowerCase().includes(q.toLowerCase()) || c.city.toLowerCase().includes(q.toLowerCase()))
  );

  const totalOutstanding = CUSTOMERS.reduce((s, c) => s + c.outstanding, 0);
  const onHold = CUSTOMERS.filter(c => c.status === "On Hold").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Customers" value={String(CUSTOMERS.length)} icon={Users} tone="default" />
        <KpiCard label="Active Accounts" value={String(CUSTOMERS.filter(c => c.status === "Active").length)} icon={Building2} tone="success" />
        <KpiCard label="Outstanding" value={formatINR(totalOutstanding)} delta={4.5} icon={TrendingUp} tone="warning" />
        <KpiCard label="On Hold" value={String(onHold)} icon={AlertCircle} tone="destructive" />
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between pb-2">
          <div>
            <CardTitle className="text-base">Customer Directory</CardTitle>
            <CardDescription>Complete client master</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search name / contact / city…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9 w-64" />
            </div>
            <Select value={ind} onValueChange={setInd}>
              <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All industries</SelectItem>
                <SelectItem value="FMCG">FMCG</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Pharma">Pharma</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.success("Exported customers.csv")}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={() => toast.success("New customer form opened")}>
              <Plus className="h-4 w-4 mr-1" /> Add Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>City</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead className="text-right">Credit Limit</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">since {c.since}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{c.industry}</Badge></TableCell>
                  <TableCell>
                    <div className="text-sm">{c.contact}</div>
                    <div className="text-[11px] text-muted-foreground">{c.phone}</div>
                  </TableCell>
                  <TableCell className="text-sm">{c.city}</TableCell>
                  <TableCell className="font-mono text-[11px]">{c.gstin}</TableCell>
                  <TableCell className="text-right tabular-nums text-sm">{formatINR(c.creditLimit)}</TableCell>
                  <TableCell className={`text-right tabular-nums text-sm ${c.outstanding > c.creditLimit * 0.7 ? "text-destructive font-medium" : ""}`}>
                    {formatINR(c.outstanding)}
                  </TableCell>
                  <TableCell><StatusPill value={c.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
