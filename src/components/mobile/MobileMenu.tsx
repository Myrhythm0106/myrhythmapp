
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Drawer, 
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Calendar, HeartPulse, Brain, User, Users, Heart, Info, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  
  // Primary navigation items
  const primaryNavItems = [
    { to: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard", badge: null },
    { to: "/calendar", icon: <Calendar className="h-5 w-5" />, label: "Calendar", badge: null },
    { to: "/tracking", icon: <HeartPulse className="h-5 w-5" />, label: "Health Tracking", badge: null },
    { to: "/home", icon: <Brain className="h-5 w-5" />, label: "Brain Recovery", badge: "New" },
  ];
  
  // Secondary navigation items
  const secondaryNavItems = [
    { to: "/profile", icon: <User className="h-5 w-5" />, label: "My Profile", badge: null },
    { to: "/community", icon: <Users className="h-5 w-5" />, label: "Community", badge: null },
    { to: "/personal-community", icon: <Heart className="h-5 w-5" />, label: "My Support", badge: null },
    { to: "/useful-info", icon: <Info className="h-5 w-5" />, label: "Resources", badge: null },
  ];

  // Helper navigation items
  const helperNavItems = [
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings", badge: null },
    { to: "/help", icon: <HelpCircle className="h-5 w-5" />, label: "Help & Support", badge: null },
  ];

  return (
    <div className="block md:hidden fixed top-4 right-4 z-40">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full shadow-md bg-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] rounded-t-xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-beacon-600" />
                <span className="text-lg font-semibold">MyRhythm</span>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-6">
                {/* Primary Navigation */}
                <div className="space-y-2">
                  <h3 className="text-xs text-muted-foreground font-medium uppercase px-2">Essential</h3>
                  <nav className="grid gap-2">
                    {primaryNavItems.map((item) => (
                      <MobileNavItem 
                        key={item.to}
                        to={item.to} 
                        icon={item.icon} 
                        label={item.label} 
                        badge={item.badge}
                        closeMenu={() => setOpen(false)}
                      />
                    ))}
                  </nav>
                </div>
                
                {/* Secondary Navigation */}
                <div className="space-y-2">
                  <h3 className="text-xs text-muted-foreground font-medium uppercase px-2">Additional</h3>
                  <nav className="grid gap-2">
                    {secondaryNavItems.map((item) => (
                      <MobileNavItem 
                        key={item.to}
                        to={item.to} 
                        icon={item.icon} 
                        label={item.label} 
                        badge={item.badge}
                        closeMenu={() => setOpen(false)}
                      />
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            
            <div className="border-t p-4">
              <nav className="grid gap-2">
                {helperNavItems.map((item) => (
                  <MobileNavItem 
                    key={item.to}
                    to={item.to} 
                    icon={item.icon} 
                    label={item.label} 
                    badge={item.badge}
                    closeMenu={() => setOpen(false)}
                  />
                ))}
              </nav>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | null;
  closeMenu: () => void;
}

function MobileNavItem({ to, icon, label, badge, closeMenu }: MobileNavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({isActive}) => cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "hover:bg-muted text-foreground/80"
      )}
      onClick={closeMenu}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
