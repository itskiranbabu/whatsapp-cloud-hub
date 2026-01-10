import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations, contacts..."
              className="w-72 pl-10 bg-muted/50 border-transparent focus:border-primary focus:bg-background"
            />
          </div>

          {/* New Message Button */}
          <Button className="gap-2 btn-whatsapp">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Message</span>
          </Button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Team Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
