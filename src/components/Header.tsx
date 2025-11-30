import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  TrashIcon,
  HeartIcon,
  UserIcon
} from "@heroicons/react/24/outline";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const navigationItems = [
    { icon: HomeIcon, label: 'หน้าแรก', path: '/' },
    { icon: WrenchScrewdriverIcon, label: 'ซ่อมแซม', path: '/repair' },
    { icon: TrashIcon, label: 'ขยะ', path: '/waste' },
    { icon: HeartIcon, label: 'บริจาค', path: '/resources' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">HY</span>
            </div>
            <h1 className="text-lg font-semibold text-foreground">Hat Yai Restart</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {user.name}
                </span>
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarImage src={user.profile?.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary-light text-primary font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex"
                >
                  ออกจากระบบ
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} size="sm">
                เข้าสู่ระบบ
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <nav className="md:hidden mt-3 flex justify-around">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 p-2"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
