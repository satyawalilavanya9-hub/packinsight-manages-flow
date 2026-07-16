import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KpiCard } from "@/components/kpi-card";
import { StatusPill } from "@/components/status-pill";
import { UserCog, UserCheck, Clock, TrendingUp, Search, Plus } from "lucide-react";
import { EMPLOYEES } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/employees")({
  head: () => ({ meta: [{ title: "Employees — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const filtered = EMPLOYEES.filter(e =>
    (dept === "all" || e.department === dept) &&
    (!q || e.name.toLowerCase().includes(q.toLowerCase()) || e.designation.toLowerCase().includes(q.toLowerCase()))
  );

  const present = EMPLOYEES.filter(e => e.status === "Present").length;
  const avgPerf = Math.round(EMPLOYEES.reduce((s, e) => s + e.performance, 0) / EMPLOYEES.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Employees" value={String(EMPLOYEES.length)} icon={UserCog} tone="default" />
        <KpiCard label="Present Today" value={`${present} / ${EMPLOYEES.length}`} icon={UserCheck} tone="success" />
        <KpiCard label="Shifts Running" value="3 (A/B/C)" icon={Clock} tone="info" />
        <KpiCard label="Avg Performance" value={`${avgPerf}%`} delta={1.8} icon={TrendingUp} tone="success" />
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between pb-2">
          <div>
            <CardTitle className="text-base">Employee Directory</CardTitle>
            <CardDescription>Workforce records & performance</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search name / role…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9 w-56" />
            </div>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                <SelectItem value="Quality">Quality</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => toast.success("New employee form opened")}>
              <Plus className="h-4 w-4 mr-1" /> Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                          {e.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{e.name}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{e.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{e.designation}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{e.department}</Badge></TableCell>
                  <TableCell className="text-sm">{e.shift}</TableCell>
                  <TableCell>
                    <div className="text-xs">{e.phone}</div>
                    <div className="text-[10px] text-muted-foreground">{e.email}</div>
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <Progress value={e.performance} className="h-1.5 flex-1" />
                      <span className="text-[11px] tabular-nums w-8 text-right">{e.performance}%</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusPill value={e.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
