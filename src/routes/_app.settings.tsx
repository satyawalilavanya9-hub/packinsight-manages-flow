import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/status-pill";
import { COMPANY, CURRENT_USER, EMPLOYEES } from "@/lib/mock-data";
import { Download, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getTheme, setTheme } from "@/lib/auth";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  useEffect(() => { setThemeState(getTheme()); }, []);
  const toggle = (checked: boolean) => {
    const next = checked ? "dark" : "light";
    setTheme(next); setThemeState(next);
    toast.success(`Switched to ${next} mode`);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">My Profile</CardTitle>
              <CardDescription>Personal information visible to your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 pb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {CURRENT_USER.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{CURRENT_USER.name}</div>
                  <div className="text-sm text-muted-foreground">{CURRENT_USER.designation} · {CURRENT_USER.department}</div>
                  <Badge className="mt-1" variant="outline">Employee ID · {CURRENT_USER.employeeId}</Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <div><Label>Full name</Label><Input defaultValue={CURRENT_USER.name} className="mt-1.5" /></div>
                <div><Label>Designation</Label><Input defaultValue={CURRENT_USER.designation} className="mt-1.5" /></div>
                <div><Label>Department</Label><Input defaultValue={CURRENT_USER.department} className="mt-1.5" /></div>
                <div><Label>Email</Label><Input defaultValue={CURRENT_USER.email} className="mt-1.5" /></div>
                <div><Label>Phone</Label><Input defaultValue={CURRENT_USER.phone} className="mt-1.5" /></div>
                <div><Label>Employee ID</Label><Input defaultValue={CURRENT_USER.employeeId} disabled className="mt-1.5" /></div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Company Details</CardTitle>
              <CardDescription>Master info used in invoices, reports and communications</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Legal name</Label><Input defaultValue={COMPANY.legal} className="mt-1.5" /></div>
              <div><Label>Trade name</Label><Input defaultValue={COMPANY.name} className="mt-1.5" /></div>
              <div><Label>GSTIN</Label><Input defaultValue={COMPANY.gstin} className="mt-1.5" /></div>
              <div><Label>Phone</Label><Input defaultValue={COMPANY.phone} className="mt-1.5" /></div>
              <div><Label>Email</Label><Input defaultValue={COMPANY.email} className="mt-1.5" /></div>
              <div><Label>Website</Label><Input defaultValue={COMPANY.website} className="mt-1.5" /></div>
              <div className="md:col-span-2"><Label>Registered address</Label><Input defaultValue={COMPANY.address} className="mt-1.5" /></div>
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={() => toast.success("Company details saved")}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Users & Roles</CardTitle>
              <CardDescription>Team access and role permissions</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EMPLOYEES.map(e => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div className="text-sm font-medium">{e.name}</div>
                        <div className="text-[11px] text-muted-foreground">{e.email}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{e.department}</Badge></TableCell>
                      <TableCell className="text-sm">
                        {e.designation.includes("Manager") ? "Manager" :
                         e.designation.includes("Analyst") ? "Analyst" :
                         e.designation.includes("QA") ? "Analyst" :
                         e.designation.includes("Operator") ? "Operator" : "Admin"}
                      </TableCell>
                      <TableCell><StatusPill value={e.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Choose what triggers an alert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { l: "Low stock alerts", d: "When raw material falls below reorder level" },
                { l: "Downtime alerts", d: "When any machine goes DOWN for >15 minutes" },
                { l: "Critical NCR raised", d: "Immediate notification for critical quality issues" },
                { l: "Payment overdue", d: "Reminder emails for outstanding above 60 days" },
                { l: "Daily production summary", d: "6:15 AM digest to production heads" },
                { l: "Weekly analytics digest", d: "Monday 9:00 AM digest to management" },
              ].map(n => (
                <div key={n.l} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm font-medium">{n.l}</div>
                    <div className="text-xs text-muted-foreground">{n.d}</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Theme preferences</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "light" ? <Sun className="h-5 w-5 text-warning-foreground" /> : <Moon className="h-5 w-5 text-primary" />}
                <div>
                  <div className="text-sm font-medium">Dark mode</div>
                  <div className="text-xs text-muted-foreground">Better for night shift operators</div>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Data Backup</CardTitle>
              <CardDescription>Export a full snapshot of your PackInsight data</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => toast.success("Backup started — you'll get an email when it's ready")}>
                <Download className="h-4 w-4 mr-2" /> Backup Now
              </Button>
              <Button variant="outline" onClick={() => toast.info("Scheduled: every Sunday 02:00 IST")}>
                Backup Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">About PackInsight</CardTitle>
              <CardDescription>Version and credits</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <div><span className="font-medium text-foreground">Product:</span> PackInsight ERP v1.0.0</div>
              <div><span className="font-medium text-foreground">Built for:</span> {COMPANY.legal}</div>
              <div><span className="font-medium text-foreground">Author:</span> {CURRENT_USER.name} — {CURRENT_USER.designation}</div>
              <div><span className="font-medium text-foreground">Release:</span> Q3 2026</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
