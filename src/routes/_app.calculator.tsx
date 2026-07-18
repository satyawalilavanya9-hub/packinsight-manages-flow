import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, Package, IndianRupee, TrendingUp, Truck, Copy, Box } from "lucide-react";
import { formatINR } from "@/lib/mock-data";
import { Box3D } from "@/components/box-3d";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/calculator")({
  head: () => ({ meta: [{ title: "Box Cost Calculator — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: CalculatorPage,
});

// Kraft paper prices per kg (INR) — realistic mid-2026 numbers
const KRAFT_PRICE = { 120: 42, 140: 44, 150: 45, 180: 48, 200: 52 } as const;
const INK_COST_PER_BOX = { 0: 0, 1: 0.35, 2: 0.7, 4: 1.5 } as const;

function CalculatorPage() {
  const { t } = useLang();
  const [length, setLength] = useState(400);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(250);
  const [gsm, setGsm] = useState<keyof typeof KRAFT_PRICE>(180);
  const [ply, setPly] = useState<3 | 5 | 7>(5);
  const [colors, setColors] = useState<keyof typeof INK_COST_PER_BOX>(2);
  const [quantity, setQuantity] = useState(5000);
  const [margin, setMargin] = useState(22);

  const calc = useMemo(() => {
    // Blank size (mm) — simplified RSC formula: (2L + 2W + trim) x (W + H + flaps)
    const blankL = 2 * length + 2 * width + 40;
    const blankW = width + height + 60;
    const blankAreaM2 = (blankL / 1000) * (blankW / 1000);

    // Total paper weight per box = area × gsm × ply × wastage
    const paperKgPerBox = (blankAreaM2 * gsm * ply) / 1000 * 1.08;
    const paperCost = paperKgPerBox * KRAFT_PRICE[gsm];
    const inkCost = INK_COST_PER_BOX[colors];
    const glueCost = 0.4 + ply * 0.15;
    const laborCost = 1.2 + (ply - 3) * 0.3;
    const overhead = 1.8;

    const costPerBox = paperCost + inkCost + glueCost + laborCost + overhead;
    const sellPerBox = costPerBox * (1 + margin / 100);
    const totalCost = costPerBox * quantity;
    const totalRevenue = sellPerBox * quantity;
    const totalMargin = totalRevenue - totalCost;
    const gst = totalRevenue * 0.18;

    // Delivery ETA — based on quantity vs typical throughput (12k boxes/day)
    const productionDays = Math.max(2, Math.ceil(quantity / 12000));
    const eta = productionDays + 2; // + 2 days dispatch

    return {
      blankL, blankW, paperKgPerBox, paperCost, inkCost, glueCost, laborCost, overhead,
      costPerBox, sellPerBox, totalCost, totalRevenue, totalMargin, gst,
      grandTotal: totalRevenue + gst, productionDays, eta,
    };
  }, [length, width, height, gsm, ply, colors, quantity, margin]);

  const suggestedCode = `MP-${ply}${colors ? "P" : ""}-${length}-${width}-${height}-${gsm}`;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Smart Quote & Box Cost Calculator</CardTitle>
              <CardDescription>Instant material cost, price and delivery ETA for any custom RSC carton</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        {/* Inputs */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Box Specifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div><Label className="text-xs">Length (mm)</Label><Input type="number" value={length} onChange={(e) => setLength(+e.target.value)} className="mt-1 h-9" /></div>
              <div><Label className="text-xs">Width (mm)</Label><Input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} className="mt-1 h-9" /></div>
              <div><Label className="text-xs">Height (mm)</Label><Input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} className="mt-1 h-9" /></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">GSM (kraft weight)</Label>
                <Select value={String(gsm)} onValueChange={(v) => setGsm(+v as keyof typeof KRAFT_PRICE)}>
                  <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.keys(KRAFT_PRICE).map((g) => <SelectItem key={g} value={g}>{g} GSM</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Ply</Label>
                <Select value={String(ply)} onValueChange={(v) => setPly(+v as 3 | 5 | 7)}>
                  <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3-ply</SelectItem><SelectItem value="5">5-ply</SelectItem><SelectItem value="7">7-ply</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Printing colors</Label>
              <Select value={String(colors)} onValueChange={(v) => setColors(+v as keyof typeof INK_COST_PER_BOX)}>
                <SelectTrigger className="mt-1 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Plain (no print)</SelectItem>
                  <SelectItem value="1">1 color</SelectItem>
                  <SelectItem value="2">2 colors</SelectItem>
                  <SelectItem value="4">4 colors (CMYK)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div><Label className="text-xs">Order quantity (pcs)</Label><Input type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value)} className="mt-1 h-9" /></div>
            <div>
              <Label className="text-xs">Target margin: <span className="font-mono text-primary">{margin}%</span></Label>
              <input type="range" min={10} max={40} value={margin} onChange={(e) => setMargin(+e.target.value)}
                className="w-full mt-2 accent-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Box className="h-4 w-4" /> {t("calc.preview")}</CardTitle>
              <CardDescription>{length} × {width} × {height} mm · {ply}-ply · {colors === 0 ? "plain" : `${colors}-color print`}</CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-muted/40 to-background rounded-b-lg">
              <Box3D length={length} width={width} height={height} colors={colors} />
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-6">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs uppercase tracking-widest opacity-80">Quote — Grand Total (incl. 18% GST)</div>
                  <div className="text-4xl font-bold tabular-nums mt-1">{formatINR(calc.grandTotal)}</div>
                  <div className="text-sm opacity-80 mt-1">
                    {formatINR(calc.sellPerBox)} × {quantity.toLocaleString("en-IN")} boxes
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest opacity-80">Delivery ETA</div>
                  <div className="text-2xl font-semibold flex items-center gap-1"><Truck className="h-5 w-5" /> {calc.eta} days</div>
                  <div className="text-xs opacity-70">{calc.productionDays}d production + 2d dispatch</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile label="Cost / box" value={formatINR(calc.costPerBox)} icon={IndianRupee} />
            <MetricTile label="Sell / box" value={formatINR(calc.sellPerBox)} icon={IndianRupee} />
            <MetricTile label="Total margin" value={formatINR(calc.totalMargin)} icon={TrendingUp} tone="success" />
            <MetricTile label="Paper / box" value={`${calc.paperKgPerBox.toFixed(3)} kg`} icon={Package} />
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Cost breakdown per box</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              {[
                ["Kraft paper", calc.paperCost],
                ["Printing ink", calc.inkCost],
                ["Corrugation glue", calc.glueCost],
                ["Labor & shift", calc.laborCost],
                ["Machine + overhead", calc.overhead],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between border-b border-border/50 py-1.5 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono tabular-nums">{formatINR(val as number)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-semibold border-t-2 border-border">
                <span>Total cost per box</span>
                <span className="font-mono tabular-nums text-primary">{formatINR(calc.costPerBox)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border-accent">
            <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Suggested SKU code</div>
                <div className="font-mono font-semibold text-primary mt-1">{suggestedCode}</div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Blank size: {calc.blankL} × {calc.blankW} mm · {ply}-ply · {gsm} GSM
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-primary/40 text-primary">Auto-generated</Badge>
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(suggestedCode); toast.success("SKU copied"); }}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                </Button>
                <Button size="sm" onClick={() => toast.success(`Quote sent to sales team — ${suggestedCode}`)}>Send quote</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value, icon: Icon, tone = "default" }: { label: string; value: string; icon: typeof Package; tone?: "default" | "success" }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {label}
        </div>
        <div className={`mt-1 text-lg font-semibold tabular-nums ${tone === "success" ? "text-success" : "text-foreground"}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
