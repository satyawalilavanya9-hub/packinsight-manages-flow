import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Factory, ShieldCheck, TrendingUp, Sparkles, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { login, getSession } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";
import { COMPANY, CURRENT_USER } from "@/lib/mock-data";
import { toast } from "sonner";
import logo from "@/assets/mannat-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — PackInsight | Mannat Packaging" },
      { name: "description", content: "Sign in to PackInsight, the internal ERP & analytics dashboard for Mannat Packaging." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<Role>("Analyst");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [splash, setSplash] = useState(false);

  useEffect(() => {
    if (getSession()) navigate({ to: "/dashboard" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Enter email and password"); return; }
    setLoading(true);
    setSplash(true);
    setTimeout(() => {
      login(email, password, role, remember);
      toast.success(`Welcome back, ${CURRENT_USER.name.split(" ")[0]}`);
      navigate({ to: "/dashboard" });
    }, 1400);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Splash overlay after submit */}
      {splash && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sidebar text-sidebar-foreground animate-in fade-in duration-300">
          <img src={logo} alt="Mannat Packaging" width={112} height={112}
               className="h-28 w-28 object-contain drop-shadow-2xl animate-in zoom-in-50 duration-700" />
          <div className="mt-6 text-2xl font-semibold tracking-tight animate-in slide-in-from-bottom-4 duration-500 delay-200">PackInsight</div>
          <div className="mt-1 text-xs uppercase tracking-[0.3em] text-sidebar-foreground/60 animate-in fade-in duration-500 delay-500">Mannat Packaging · Loading control room</div>
          <div className="mt-8 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-sidebar-primary animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      )}

      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
             style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute -bottom-20 -right-20 opacity-[0.06]">
          <img src={logo} alt="" width={500} height={500} className="w-[500px] h-[500px] object-contain" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mannat" width={44} height={44} className="h-11 w-11 object-contain" />
            <div>
              <div className="text-lg font-semibold">PackInsight</div>
              <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/70">{COMPANY.name}</div>
            </div>
          </div>
        </div>

        <div className="relative space-y-6 max-w-md">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sidebar-primary/15 border border-sidebar-primary/30 px-2.5 py-1 text-[10px] uppercase tracking-widest text-sidebar-primary font-medium">
            <Sparkles className="h-3 w-3" /> AI-powered ERP
          </div>
          <h1 className="text-3xl font-semibold leading-tight">
            One control room for every corrugator, printer and pallet.
          </h1>
          <p className="text-sm text-sidebar-foreground/75">
            Track production output, OEE, quality rejections, inventory and sales — with an on-board
            AI analyst and live shop-floor mode.
          </p>
          <div className="grid grid-cols-4 gap-2 pt-4">
            {[
              { icon: Factory, label: "Live production" },
              { icon: ShieldCheck, label: "Quality & NCR" },
              { icon: Leaf, label: "Sustainability" },
              { icon: TrendingUp, label: "AI insights" },
            ].map((f) => (
              <div key={f.label} className="rounded-md border border-sidebar-border/60 bg-sidebar-accent/30 p-2.5">
                <f.icon className="h-3.5 w-3.5 text-sidebar-primary" />
                <div className="mt-1.5 text-[10px] text-sidebar-foreground/85 leading-tight">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-[11px] text-sidebar-foreground/60">
          © {new Date().getFullYear()} {COMPANY.legal} · GSTIN {COMPANY.gstin} · Built by Lavanya Satyawali
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 shadow-lg border-border/60">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <img src={logo} alt="Mannat" width={36} height={36} className="h-9 w-9 object-contain" />
            <div className="font-semibold">PackInsight</div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Access your Mannat Packaging control room
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mannatpackaging.in" className="mt-1.5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" onClick={() => toast.info("Password reset link sent to your email")}
                  className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5" />
            </div>
            <div>
              <Label>Sign in as</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin — full access</SelectItem>
                  <SelectItem value="Manager">Manager — production & sales</SelectItem>
                  <SelectItem value="Analyst">Analyst — analytics & reports</SelectItem>
                  <SelectItem value="Operator">Operator — shop-floor entry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me on this device</Label>
            </div>
            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? "Signing in…" : "Sign in to PackInsight"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Demo credentials</div>
            <div>Any email / password works. Pre-filled for {CURRENT_USER.name}.</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
