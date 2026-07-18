import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Factory, ShieldCheck, Boxes, ShoppingCart,
  Users, UserCog, BarChart3, FileText, Settings, LogOut,
  Sparkles, MonitorPlay, Leaf, Calculator,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRENT_USER, COMPANY } from "@/lib/mock-data";
import { logout } from "@/lib/auth";
import { toast } from "sonner";
import logo from "@/assets/mannat-logo.png";

const OPERATIONS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Production", url: "/production", icon: Factory },
  { title: "Shop-Floor Live", url: "/shop-floor", icon: MonitorPlay, isNew: true },
  { title: "Quality Control", url: "/quality", icon: ShieldCheck },
  { title: "Inventory", url: "/inventory", icon: Boxes },
];
const COMMERCIAL = [
  { title: "Sales", url: "/sales", icon: ShoppingCart },
  { title: "Box Calculator", url: "/calculator", icon: Calculator, isNew: true },
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Employees", url: "/employees", icon: UserCog },
];
const INSIGHTS = [
  { title: "AI Insights", url: "/ai-insights", icon: Sparkles, isNew: true },
  { title: "Sustainability", url: "/sustainability", icon: Leaf, isNew: true },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const isActive = (url: string) => pathname === url;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const renderGroup = (label: string, items: typeof OPERATIONS) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}
                className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary data-[active=true]:border-l-2 data-[active=true]:border-sidebar-primary">
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="text-sm flex-1 flex items-center justify-between">
                      {item.title}
                      {"isNew" in item && item.isNew && (
                        <Badge className="h-4 px-1.5 text-[9px] bg-sidebar-primary/20 text-sidebar-primary border-0 hover:bg-sidebar-primary/30">NEW</Badge>
                      )}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Mannat" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-semibold text-sidebar-foreground truncate leading-tight">PackInsight</div>
              <div className="text-[10px] text-sidebar-foreground/60 truncate uppercase tracking-widest">{COMPANY.name}</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {renderGroup("Operations", OPERATIONS)}
        {renderGroup("Commercial", COMMERCIAL)}
        {renderGroup("Insights", INSIGHTS)}
      </SidebarContent>


      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-sidebar-border">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                  {CURRENT_USER.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-sidebar-foreground truncate">{CURRENT_USER.name}</div>
                <div className="text-[11px] text-sidebar-foreground/60 truncate">{CURRENT_USER.designation}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        ) : (
          <Avatar className="h-8 w-8 mx-auto">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
              {CURRENT_USER.avatarInitials}
            </AvatarFallback>
          </Avatar>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
