import { Home, ClipboardList, Map, User } from "lucide-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "หน้าหลัก", icon: Home, path: "/" },
  { id: "jobs", label: "งานของฉัน", icon: ClipboardList, path: "/my-jobs" },
  { id: "map", label: "แผนที่", icon: Map, path: "/map" },
  { id: "profile", label: "โปรไฟล์", icon: User, path: "/profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border animate-slide-up">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <RouterNavLink
                key={item.id}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all tap-highlight-none hover:bg-secondary active:scale-95",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isActive && "bg-primary-light"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                </div>
                <span className={cn("text-xs font-medium", isActive && "text-primary")}>
                  {item.label}
                </span>
              </RouterNavLink>
            );
          })}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
};

export default BottomNav;
