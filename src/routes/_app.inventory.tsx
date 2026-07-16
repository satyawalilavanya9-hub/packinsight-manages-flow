import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/kpi-card";
import { Boxes, PackageX, Truck, Warehouse, Search, Plus, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INVENTORY, formatNum } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/inventory")({
  head: () => ({ meta: [{ title: "Inventory — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: InventoryPage,
});

const MOVEMENTS = [
  { id: "MV-901", date: "2026-07-16", item: "Kraft Liner 150 GSM", type: "IN", qty: 8000, party: "ITC Paperboards" },
  { id: "MV-902", date: "2026-07-16", item: "Corrugation Starch Glue", type: "OUT", qty: 120, party: "Line A" },
  { id: "MV-903", date: "2026-07-15", item: "Flexo Ink (Cyan)", type: "IN", qty: 100, party: "Sakata Inx" },
  { id: "MV-904", date: "2026-07-15", item: "Fluting Medium 120 GSM", type: "OUT", qty: 4200, party: "Line B" },
  { id: "MV-905", date: "2026-07-14", item: "Stitching Wire 22 SWG", type: "IN", qty: 200, party: "Bansal Wires" },
];

function InventoryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const filtered = INVENTORY.filter((i) =>
    (cat === "all" || i.category === cat) &&
    (!q || i.name.toLowerCase().includes(q.toLowerCase()) || i.supplier.toLowerCase().includes(q.toLowerCase()))
  );

  const rawValue = INVENTORY.filter(i => i.category !== "Finished Goods").length;
  const fgValue = INVENTORY.filter(i => i.category === "Finished Goods").length;
  const lowStock = INVENTORY.filter(i => i.stock < i.reorderLevel).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Raw Materials" value={`${rawValue} SKUs`} icon={Boxes} tone="info" />
        <KpiCard label="Finished Goods" value={`${fgValue} SKUs`} icon={Warehouse} tone="default" />
        <KpiCard label="Low Stock Alerts" value={String(lowStock)} icon={PackageX} tone="warning" />
        <KpiCard label="Pending GRNs" value="4" delta={2} deltaLabel="in transit" icon={Truck} tone="success" />
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between pb-2">
          <div>
            <CardTitle className="text-base">Stock Register</CardTitle>
            <CardDescription>Raw materials & finished goods</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search item or supplier…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9 w-56" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Paper Reel">Paper Reel</SelectItem>
                <SelectItem value="Glue">Glue</SelectItem>
                <SelectItem value="Ink">Ink</SelectItem>
                <SelectItem value="Stitching Wire">Stitching Wire</SelectItem>
                <SelectItem value="Finished Goods">Finished Goods</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.success("Exported inventory.csv")}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" onClick={() => toast.success("New item form opened")}>
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Reorder</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => {
                const pct = Math.min(100, Math.round((i.stock / (i.reorderLevel * 2)) * 100));
                const low = i.stock < i.reorderLevel;
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.id}</TableCell>
                    <TableCell className="text-sm">{i.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{i.category}</Badge></TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatNum(i.stock)} {i.uom}</TableCell>
                    <TableCell className="text-right tabular-nums text-xs text-muted-foreground">{formatNum(i.reorderLevel)}</TableCell>
                    <TableCell className="min-w-[120px]">
                      <Progress value={pct} className={`h-1.5 ${low ? "[&>div]:bg-destructive" : ""}`} />
                    </TableCell>
                    <TableCell className="text-xs">{i.supplier}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{i.lastUpdated}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Stock Movement</CardTitle>
          <CardDescription>Last 48 hours</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Party / Line</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOVEMENTS.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{m.id}</TableCell>
                  <TableCell className="text-xs">{m.date}</TableCell>
                  <TableCell className="text-sm">{m.item}</TableCell>
                  <TableCell>
                    <Badge className={m.type === "IN" ? "bg-success/15 text-success border-success/30" : "bg-info/15 text-info border-info/30"} variant="outline">{m.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatNum(m.qty)}</TableCell>
                  <TableCell className="text-sm">{m.party}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
