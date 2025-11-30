"use client"

import { MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  title: string;
  location: string;
  status: string;
  time: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // General / Job
  open: { label: "รอรับเรื่อง", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  in_progress: { label: "กำลังดำเนินการ", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "เสร็จสิ้น", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  cancelled: { label: "ยกเลิก", className: "bg-red-500/10 text-red-500 border-red-500/20" },

  // Waste
  reported: { label: "แจ้งแล้ว", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  acknowledged: { label: "รับเรื่องแล้ว", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  cleared: { label: "กำจัดแล้ว", className: "bg-green-500/10 text-green-500 border-green-500/20" },

  // Resource
  available: { label: "ว่าง", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  assigned: { label: "จองแล้ว", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  distributed: { label: "ส่งมอบแล้ว", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },

  // Need
  pending: { label: "รอความช่วยเหลือ", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  matched: { label: "จับคู่แล้ว", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  fulfilled: { label: "ได้รับแล้ว", className: "bg-green-500/10 text-green-500 border-green-500/20" },
};

const RecentActivity = ({ activities = [] }: RecentActivityProps) => {
  if (activities.length === 0) {
    return (
      <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          อัปเดตล่าสุดแถวนี้
        </h2>
        <Card className="p-6 text-center text-muted-foreground">
          <p>ยังไม่มีกิจกรรมล่าสุด</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
      <h2 className="text-lg font-semibold text-foreground mb-3">
        อัปเดตล่าสุดแถวนี้
      </h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const status = statusConfig[activity.status] || { label: activity.status, className: "bg-gray-100 text-gray-500" };

          return (
            <Card
              key={activity.id}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 truncate">
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{activity.location || "ไม่ระบุตำแหน่ง"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium whitespace-nowrap", status.className)}
                >
                  {status.label}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivity;
