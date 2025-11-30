"use client"

import { MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  title: string;
  location: string;
  status: "pending" | "in-progress" | "completed";
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    title: "ต้องการรถยกสูง",
    location: "ซอย 3 เพชรเกษม",
    status: "pending",
    time: "10 นาทีที่แล้ว",
  },
  {
    id: "2",
    title: "ขยะตู้เสื้อผ้า",
    location: "ตลาดกิมหยง",
    status: "in-progress",
    time: "25 นาทีที่แล้ว",
  },
  {
    id: "3",
    title: "ต้องการช่างไฟฟ้า",
    location: "หาดใหญ่ใน",
    status: "completed",
    time: "1 ชั่วโมงที่แล้ว",
  },
];

const statusConfig = {
  pending: {
    label: "รอรับเรื่อง",
    className: "bg-alert/10 text-alert border-alert/20",
  },
  "in-progress": {
    label: "กำลังดำเนินการ",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "เสร็จสิ้น",
    className: "bg-success/10 text-success border-success/20",
  },
};

const RecentActivity = () => {
  return (
    <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
      <h2 className="text-lg font-semibold text-foreground mb-3">
        อัปเดตล่าสุดแถวนี้
      </h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const status = statusConfig[activity.status];

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
                    <span className="truncate">{activity.location}</span>
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
