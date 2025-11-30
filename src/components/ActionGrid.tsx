"use client";

import { Wrench, MapPin, Gift, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  variant: "primary" | "alert" | "success" | "emergency";
  description: string;
  href: string;
}

const actions: ActionItem[] = [
  {
    id: "find-help",
    label: "หาช่าง/กู้ภัย",
    icon: Wrench,
    variant: "primary",
    description: "ค้นหาความช่วยเหลือ",
    href: "/repair",
  },
  {
    id: "report-waste",
    label: "แจ้งจุดขยะ",
    icon: MapPin,
    variant: "alert",
    description: "รายงานขยะตกค้าง",
    href: "/waste",
  },
  {
    id: "donate",
    label: "บริจาคสิ่งของ",
    icon: Gift,
    variant: "success",
    description: "ช่วยเหลือผู้ประสบภัย",
    href: "/resources",
  },
  {
    id: "emergency",
    label: "เบอร์ฉุกเฉิน",
    icon: Phone,
    variant: "emergency",
    description: "ติดต่อหน่วยกู้ชีพ",
    href: "/emergency",
  },
];

const variantStyles = {
  primary: {
    card: "bg-primary-light hover:bg-primary/10 border-primary/20",
    icon: "bg-primary text-primary-foreground",
    text: "text-primary",
  },
  alert: {
    card: "bg-alert-light hover:bg-alert/10 border-alert/20",
    icon: "bg-alert text-alert-foreground",
    text: "text-alert",
  },
  success: {
    card: "bg-success-light hover:bg-success/10 border-success/20",
    icon: "bg-success text-success-foreground",
    text: "text-success",
  },
  emergency: {
    card: "bg-emergency-light hover:bg-emergency/10 border-emergency/20",
    icon: "bg-emergency text-emergency-foreground",
    text: "text-emergency",
  },
};

const ActionGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => {
        const styles = variantStyles[action.variant];
        const Icon = action.icon;

        return (
          <Link key={action.id} href={action.href} className="block">
            <Card
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all duration-200 tap-highlight-none",
                "hover:scale-[1.02] active:scale-[0.98]",
                "animate-fade-in",
                styles.card
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", styles.icon)}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={cn("font-semibold text-base mb-0.5", styles.text)}>
                {action.label}
              </h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default ActionGrid;
