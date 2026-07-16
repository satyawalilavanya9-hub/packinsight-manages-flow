import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { getTheme, setTheme as persistTheme } from "@/lib/auth";

const PAGE_TITLES: Record<string, { title: string; crumb: string }> = {
  "/dashboard": { title: "Dashboard", crumb: "Overview" },
  "/production": { title: "Production", crumb: "Operations" },
  "/quality": { title: "Quality Control", crumb: "Operations" },
  "/inventory": { title: "Inventory", crumb: "Operations" },
  "/sales": { title: "Sales", crumb: "Commercial" },
  "/customers": { title: "Customers", crumb: "Commercial" },
  "/employees": { title: "Employees", crumb: "Commercial" },
  "/analytics": { title: "Analytics", crumb: "Insights" },
  "/reports": { title: "Reports", crumb: "Insights" },
  "/settings": { title: "Settings", crumb: "Insights" },
};

export function AppHeader() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const meta = PAGE_TITLES[pathname] ?? { title: "PackInsight", crumb: "Home" };
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => { setThemeState(getTheme()); }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    persistTheme(next);
    setThemeState(next);
  };

  return (
    <header className="h-14 border-b border-border bg-card/95 backdrop-blur sticky top-0 z-30 flex items-center gap-3 px-4">
      <SidebarTrigger />
      <div className="hidden md:flex flex-col leading-tight">
        <div className="text-[11px] text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">PackInsight</Link>
          <span className="mx-1.5">/</span>
          <span>{meta.crumb}</span>
        </div>
        <div className="text-sm font-semibold text-foreground">{meta.title}</div>
      </div>

      <div className="flex-1" />

      <div className="hidden lg:flex items-center relative w-72">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search orders, SKUs, customers…" className="pl-9 h-9 bg-muted/40" />
      </div>

      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground">3</Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start gap-0.5 py-2">
            <span className="text-sm font-medium">Auto Folder-Gluer DOWN</span>
            <span className="text-xs text-muted-foreground">Belt breakage — 145 min downtime</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start gap-0.5 py-2">
            <span className="text-sm font-medium">Low stock: Fluting Medium 120 GSM</span>
            <span className="text-xs text-muted-foreground">9,800 kg below reorder level</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start gap-0.5 py-2">
            <span className="text-sm font-medium">Payment overdue — Meesho</span>
            <span className="text-xs text-muted-foreground">SO-8807 ₹12.75L</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 px-2 gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {CURRENT_USER.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium">{CURRENT_USER.name}</span>
              <span className="text-[10px] text-muted-foreground">{CURRENT_USER.designation}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span>{CURRENT_USER.name}</span>
            <span className="text-[11px] text-muted-foreground font-normal">{CURRENT_USER.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/settings">Profile & Settings</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/reports">My Reports</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/">Sign out</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
