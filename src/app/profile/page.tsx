"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { updateUserRole } from "@/app/actions/user";
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Award, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

const ProfilePage = () => {
    const { user, logout } = useAuthStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const handleRoleChange = async (newRole: string) => {
        if (!user) return;
        setIsUpdating(true);
        try {
            const result = await updateUserRole(user.id, newRole);
            if (result.success) {
                // Force a reload to get new session data if needed, or just update local state via store if we had a method
                // Ideally authStore should have an update method, but for now a reload is safest to sync everything
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to update role", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>กรุณาเข้าสู่ระบบ...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-28">

            <main className="max-w-lg mx-auto px-4 py-5">
                {/* Profile Card */}
                <Card className="p-5 rounded-2xl border border-border bg-card mb-5 animate-fade-in">
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                            <AvatarImage src={user.profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="User" />
                            <AvatarFallback className="bg-primary-light text-primary text-xl font-semibold">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-foreground">{user.name}</h1>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <Badge className="mt-2 bg-primary/10 text-primary border-primary/20 capitalize">
                                {user.role}
                            </Badge>
                        </div>
                    </div>

                    {/* Role Switcher (Dev Mode) */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                            เปลี่ยนบทบาท (สำหรับทดสอบ)
                        </label>
                        <Select
                            value={user.role}
                            onValueChange={handleRoleChange}
                            disabled={isUpdating}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกบทบาท" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="victim">ผู้ประสบภัย (Victim)</SelectItem>
                                <SelectItem value="volunteer">อาสาสมัคร (Volunteer)</SelectItem>
                                <SelectItem value="technician">ช่างซ่อม (Technician)</SelectItem>
                                <SelectItem value="donor">ผู้บริจาค (Donor)</SelectItem>
                                <SelectItem value="coordinator">ผู้ประสานงาน (Coordinator)</SelectItem>
                            </SelectContent>
                        </Select>
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
                                        <Badge className="bg-destructive text-destructive-foreground">{item.badge}</Badge>
                                    )}
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </button>
                                {index < menuItems.length - 1 && <Separator />}
                            </div>
                        );
                    })}
                </Card>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full mt-5 flex items-center justify-center gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors tap-highlight-none active:scale-[0.98] animate-fade-in"
                    style={{ animationDelay: "300ms" }}
                >
                    <LogOut className="w-5 h-5" />
                    ออกจากระบบ
                </button>
            </main>
        </div>
    );
};

export default ProfilePage;
