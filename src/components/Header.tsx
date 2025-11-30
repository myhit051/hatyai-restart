"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  TrashIcon,
  HeartIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const navigationItems = [
    { icon: HomeIcon, label: 'หน้าแรก', path: '/' },
    { icon: BriefcaseIcon, label: 'หางาน', path: '/jobs' },
    { icon: WrenchScrewdriverIcon, label: 'ซ่อมแซม', path: '/repair' },
    { icon: TrashIcon, label: 'ขยะ', path: '/waste' },
    { icon: HeartIcon, label: 'บริจาค', path: '/resources' },
    { icon: MapIcon, label: 'แผนที่', path: '/map' },
    { icon: ClipboardDocumentListIcon, label: 'งานของฉัน', path: '/my-jobs' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img
                src="https://res.cloudinary.com/dhoufeuyr/image/upload/w_64,h_64,c_fill,f_auto,q_auto/v1764490976/hytt_vru24n.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
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
                onClick={() => router.push(item.path)}
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


      </div>
    </header>
  );
};

export default Header;
