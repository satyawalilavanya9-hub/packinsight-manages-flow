import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Recycle, Droplets, Cloud, TreePine, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, Legend } from "recharts";
import { CHART, AXIS_COLOR, GRID_COLOR } from "@/lib/chart-colors";
import { KpiCard } from "@/components/kpi-card";

export const Route = createFileRoute("/_app/sustainability")({
  head: () => ({ meta: [{ title: "Sustainability — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: SustainabilityPage,
});

const CO2_TREND = [
  { month: "Feb", mannat: 2.1, industry: 2.5 }, { month: "Mar", mannat: 2.0, industry: 2.5 },
  { month: "Apr", mannat: 1.95, industry: 2.5 }, { month: "May", mannat: 1.88, industry: 2.4 },
  { month: "Jun", mannat: 1.82, industry: 2.4 }, { month: "Jul", mannat: 1.78, industry: 2.4 },
];

const WASTE_BREAKDOWN = [
  { stage: "Corrugation", waste: 1.4 }, { stage: "Printing", waste: 0.8 },
  { stage: "Die-Cutting", waste: 0.6 }, { stage: "Gluing", waste: 0.4 }, { stage: "Packing", waste: 0.2 },
];

function SustainabilityPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Leaf className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle>Green Packaging Scorecard</CardTitle>
              <CardDescription>Environmental impact of Mannat Packaging operations — Ghaziabad plant</CardDescription>
            </div>
            <Badge className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20">
              <Award className="h-3 w-3 mr-1" /> FSC Certified
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Recycled Kraft %" value="92%" delta={4.1} deltaLabel="vs LY" icon={Recycle} tone="success" />
        <KpiCard label="Paper Waste" value="3.4%" delta={-1.8} deltaLabel="vs LY" icon={Leaf} tone="success" />
        <KpiCard label="CO₂ / 1000 boxes" value="1.78 kg" delta={-15.2} deltaLabel="vs industry" icon={Cloud} tone="info" />
        <KpiCard label="Water / 1000 boxes" value="4.2 L" delta={-8.4} deltaLabel="vs LY" icon={Droplets} tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Carbon Intensity — 6 month trend</CardTitle>
            <CardDescription>kg CO₂ per 1000 boxes vs Indian corrugator industry average</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={CO2_TREND}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={AXIS_COLOR} fontSize={11} />
                <YAxis stroke={AXIS_COLOR} fontSize={11} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="mannat" stroke={CHART.emerald} strokeWidth={3} dot={{ r: 4 }} name="Mannat" />
                <Line type="monotone" dataKey="industry" stroke={CHART.gold} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Industry avg" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Paper Waste by Stage</CardTitle>
            <CardDescription>Waste % across the value chain (July 2026)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={WASTE_BREAKDOWN}>
                <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
                <XAxis dataKey="stage" stroke={AXIS_COLOR} fontSize={11} />
                <YAxis stroke={AXIS_COLOR} fontSize={11} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="waste" fill={CHART.jade} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><TreePine className="h-4 w-4 text-primary" /> ESG Progress vs 2027 Targets</CardTitle>
          <CardDescription>Mannat Packaging sustainability commitments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            { label: "Recycled fibre in kraft input", current: 92, target: 95 },
            { label: "Total paper waste reduction", current: 66, target: 70 },
            { label: "Renewable energy share (solar rooftop)", current: 38, target: 60 },
            { label: "Water recycled & reused", current: 54, target: 75 },
            { label: "Zero waste to landfill", current: 88, target: 100 },
          ].map((g) => (
            <div key={g.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{g.label}</span>
                <span className="font-mono tabular-nums text-muted-foreground">{g.current}% <span className="text-primary">/ {g.target}%</span></span>
              </div>
              <Progress value={(g.current / g.target) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TreePine className="h-8 w-8 text-primary" />
            <div>
              <div className="font-semibold">Equivalent Impact — YTD 2026</div>
              <div className="text-xs text-muted-foreground">Based on 1.24 crore boxes shipped from recycled kraft</div>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div><div className="text-2xl font-bold text-primary tabular-nums">14,820</div><div className="text-xs text-muted-foreground">trees saved</div></div>
            <div><div className="text-2xl font-bold text-primary tabular-nums">62 L</div><div className="text-xs text-muted-foreground">litres water conserved</div></div>
            <div><div className="text-2xl font-bold text-primary tabular-nums">28.4 t</div><div className="text-xs text-muted-foreground">CO₂ avoided</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
