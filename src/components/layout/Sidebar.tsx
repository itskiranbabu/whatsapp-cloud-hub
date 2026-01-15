import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Send,
  FileText,
  Users,
  Bot,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Building2,
  Check,
  ChevronsUpDown,
  Puzzle,
  Megaphone,
  Handshake,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTenants } from "@/hooks/useTenants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: MessageSquare, label: "Inbox", path: "/inbox" },
  { icon: Send, label: "Campaigns", path: "/campaigns" },
  { icon: FileText, label: "Templates", path: "/templates" },
  { icon: Users, label: "Contacts", path: "/contacts" },
  { icon: Bot, label: "Automation", path: "/automation" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Megaphone, label: "Ads Manager", path: "/ads" },
  { icon: Puzzle, label: "Integrations", path: "/integrations" },
  { icon: Handshake, label: "Partners", path: "/partners" },
  { icon: UserPlus, label: "Affiliates", path: "/affiliates" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help Center", path: "/help" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { currentTenantId, setCurrentTenantId, isSuperAdmin } = useAuth();
  const { tenants, isLoading: tenantsLoading } = useTenants();

  const currentTenant = tenants.find((t) => t.id === currentTenantId);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar flex flex-col z-50 border-r border-sidebar-border"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Zap className="w-5 h-5" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            <span className="text-sidebar-foreground font-semibold text-lg tracking-tight">
              WhatsFlow
            </span>
            <span className="text-sidebar-muted text-xs">Business API</span>
          </motion.div>
        )}
      </div>

      {/* Tenant Selector */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-3"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent cursor-pointer hover:bg-sidebar-accent/80 transition-colors w-full text-left">
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-sidebar-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {currentTenant?.name || "Select Tenant"}
                  </p>
                  <p className="text-xs text-sidebar-muted truncate">
                    {currentTenant?.plan ? `${currentTenant.plan.charAt(0).toUpperCase() + currentTenant.plan.slice(1)} Plan` : "No tenant selected"}
                  </p>
                </div>
                <ChevronsUpDown className="w-4 h-4 text-sidebar-muted shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px]">
              <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tenantsLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : tenants.length === 0 ? (
                <DropdownMenuItem disabled>No tenants available</DropdownMenuItem>
              ) : (
                tenants.map((tenant) => (
                  <DropdownMenuItem
                    key={tenant.id}
                    onClick={() => setCurrentTenantId(tenant.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{tenant.name}</span>
                    </div>
                    {currentTenantId === tenant.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
              {isSuperAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Building2 className="w-4 h-4 mr-2" />
                    Create New Tenant
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        {navigationItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                )}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-2 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};
