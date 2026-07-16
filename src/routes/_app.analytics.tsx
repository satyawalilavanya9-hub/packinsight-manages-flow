import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area,
} from "recharts";
import { REVENUE_TREND, PRODUCTION_TREND, DEFECT_PARETO, MACHINES, CUSTOMERS, ORDERS, SKUS, formatINR } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [range, setRange] = useState("30");

  const skuRevenue = SKUS.map(s => ({
    sku: s.code.split("-").slice(1,2).join("-"),
    revenue: ORDERS.filter(o => o.sku === s.id).reduce((sum, o) => sum + o.amount, 0),
  })).sort((a,b) => b.revenue - a.revenue).slice(0, 8);

  const customerContribution = CUSTOMERS.map(c => ({
    name: c.name.split(" ")[0],
    value: ORDERS.filter(o => o.customer === c.name).reduce((s, o) => s + o.amount, 0),
  })).filter(c => c.value > 0);

  const machineUtil = MACHINES.map(m => ({ machine: m.name.split(" ").slice(0,2).join(" "), oee: m.oee }));

  const industryMix = ["FMCG","Electronics","Pharma","Food","E-commerce"].map(ind => ({
    name: ind,
    value: CUSTOMERS.filter(c => c.industry === ind).length,
  }));

  const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Operational Analytics</h2>
          <p className="text-sm text-muted-foreground">Cross-functional intelligence across production, quality, sales & workforce.</p>
        </div>
        <div className="flex gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">FY26</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => toast.success("Exported analytics.pdf")}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <CardDescription>Monthly · target overlay</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={REVENUE_TREND} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" fontSize={11} tick={{ fill: "var(--color-muted-foreground)" }} />
                <YAxis fontSize={11} tick={{ fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="target" stroke="var(--color-chart-4)" strokeDasharray="5 5" name="Target" dot={false} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Production vs Target</CardTitle>
            <CardDescription>30-day rolling · defect overlay</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={PRODUCTION_TREND} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" fontSize={10} tick={{ fill: "var(--color-muted-foreground)" }} interval={4} />
                <YAxis fontSize={11} tick={{ fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="output" fill="var(--color-chart-2)" fillOpacity={0.25} stroke="var(--color-chart-2)" name="Output" />
                <Line type="monotone" dataKey="target" stroke="var(--color-chart-4)" strokeDasharray="4 4" name="Target" dot={false} />
                <Bar dataKey="defects" fill="var(--color-chart-5)" name="Defects" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Defect Pareto</CardTitle>
            <CardDescription>Which defects hurt us most</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={DEFECT_PARETO} margin={{ left: 8, right: 8 }}>
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
            <CardTitle className="text-base">Machine OEE Utilization</CardTitle>
            <CardDescription>Overall equipment effectiveness by asset</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={machineUtil}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="machine" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                <Radar name="OEE %" dataKey="oee" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.35} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top SKUs by Revenue</CardTitle>
            <CardDescription>Best-selling box specs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={skuRevenue} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" fontSize={11} tick={{ fill: "var(--color-muted-foreground)" }} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                <YAxis type="category" dataKey="sku" fontSize={10} width={80} tick={{ fill: "var(--color-muted-foreground)" }} />
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Bar dataKey="revenue" fill="var(--color-chart-3)" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Customer Contribution</CardTitle>
            <CardDescription>Revenue share this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={customerContribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={95} paddingAngle={1}>
                  {customerContribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Industry Mix</CardTitle>
          <CardDescription>Customer distribution across segments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={industryMix} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" fontSize={11} tick={{ fill: "var(--color-muted-foreground)" }} />
              <YAxis fontSize={11} tick={{ fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Bar dataKey="value" fill="var(--color-chart-1)" radius={[4,4,0,0]}>
                {industryMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
