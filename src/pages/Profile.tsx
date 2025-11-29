import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Award, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  variant?: "default" | "destructive";
}

const menuItems: MenuItem[] = [
  { id: "settings", label: "ตั้งค่าบัญชี", icon: Settings },
  { id: "notifications", label: "การแจ้งเตือน", icon: Bell, badge: "3" },
  { id: "privacy", label: "ความเป็นส่วนตัว", icon: Shield },
  { id: "help", label: "ช่วยเหลือ", icon: HelpCircle },
];

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-5">
        {/* Profile Card */}
        <Card className="p-5 rounded-2xl border border-border bg-card mb-5 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 ring-4 ring-primary/20">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=hatyai" alt="User" />
              <AvatarFallback className="bg-primary-light text-primary text-xl font-semibold">ส</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-foreground">สมชาย ใจดี</h1>
              <p className="text-sm text-muted-foreground">somchai@email.com</p>
              <Badge className="mt-2 bg-success/10 text-success border-success/20">
                <Award className="w-3 h-3 mr-1" />
                อาสาสมัครระดับทอง
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">งานที่ช่วย</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-2xl font-bold text-alert">5</p>
              <p className="text-xs text-muted-foreground">แจ้งขยะ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">8</p>
              <p className="text-xs text-muted-foreground">บริจาค</p>
            </div>
          </div>
        </Card>

        {/* Contribution Card */}
        <Card className="p-4 rounded-xl border border-border bg-gradient-to-r from-success-light to-primary-light mb-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
              <Heart className="w-6 h-6 text-success-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">ขอบคุณที่ร่วมฟื้นฟูหาดใหญ่!</h3>
              <p className="text-sm text-muted-foreground">คุณช่วยเหลือชุมชนไปแล้ว 25 ครั้ง</p>
            </div>
          </div>
        </Card>

        {/* Menu */}
        <Card className="rounded-xl border border-border overflow-hidden animate-fade-in" style={{ animationDelay: "200ms" }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id}>
                <button className="w-full flex items-center gap-3 p-4 hover:bg-secondary transition-colors tap-highlight-none active:bg-secondary">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-left font-medium text-foreground">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-emergency text-emergency-foreground">{item.badge}</Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            );
          })}
        </Card>

        {/* Logout */}
        <button className="w-full mt-5 flex items-center justify-center gap-2 p-4 rounded-xl border border-emergency/20 bg-emergency-light text-emergency font-medium hover:bg-emergency/10 transition-colors tap-highlight-none active:scale-[0.98] animate-fade-in" style={{ animationDelay: "300ms" }}>
          <LogOut className="w-5 h-5" />
          ออกจากระบบ
        </button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
