"use client";
import { Map, MapPin, Wrench, Trash2, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapMarker {
  id: string;
  title: string;
  type: "help" | "waste";
  location: string;
  distance: string;
}

const markers: MapMarker[] = [
  { id: "1", title: "ต้องการรถยกสูง", type: "help", location: "ซอย 3 เพชรเกษม", distance: "0.3 กม." },
  { id: "2", title: "ขยะเฟอร์นิเจอร์", type: "waste", location: "ตลาดกิมหยง", distance: "0.5 กม." },
  { id: "3", title: "ต้องการช่างประปา", type: "help", location: "หาดใหญ่ใน", distance: "0.8 กม." },
  { id: "4", title: "ขยะเครื่องใช้ไฟฟ้า", type: "waste", location: "ซอย 7", distance: "1.2 กม." },
];

const typeConfig = {
  help: {
    icon: Wrench,
    label: "ขอความช่วยเหลือ",
    bgColor: "bg-primary",
    lightBg: "bg-primary-light",
    textColor: "text-primary",
  },
  waste: {
    icon: Trash2,
    label: "จุดขยะ",
    bgColor: "bg-alert",
    lightBg: "bg-alert-light",
    textColor: "text-alert",
  },
};

const MapPage = () => {
  return (
    <div className="min-h-screen bg-background pb-28">

      <main className="max-w-lg mx-auto">
        {/* Map Placeholder */}
        <div className="relative h-64 bg-gradient-to-br from-primary-light to-secondary overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-primary/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">แผนที่หาดใหญ่</p>
              <p className="text-xs text-muted-foreground mt-1">OpenStreetMap จะแสดงที่นี่</p>
            </div>
          </div>

          {/* Mock map markers */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-pulse">
            <Wrench className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 rounded-full bg-alert flex items-center justify-center shadow-lg">
            <Trash2 className="w-4 h-4 text-alert-foreground" />
          </div>
          <div className="absolute bottom-1/4 left-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Wrench className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Button variant="outline" size="sm" className="flex-shrink-0 gap-1.5">
            <Filter className="w-4 h-4" />
            ตัวกรอง
          </Button>
          <Badge variant="secondary" className="bg-primary text-primary-foreground cursor-pointer">
            ทั้งหมด
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary-light">
            ขอความช่วยเหลือ
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-alert-light">
            จุดขยะ
          </Badge>
        </div>

        {/* Nearby List */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            จุดใกล้เคียง
          </h2>

          <div className="space-y-3">
            {markers.map((marker, index) => {
              const config = typeConfig[marker.type];
              const Icon = config.icon;

              return (
                <Card
                  key={marker.id}
                  className={cn(
                    "p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all cursor-pointer active:scale-[0.98] animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bgColor)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{marker.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="truncate">{marker.location}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">{marker.distance}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className={cn("flex-shrink-0", config.textColor)}>
                      ดู
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapPage;
