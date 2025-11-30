"use client";
import { useEffect, useState } from "react";
import { Map, MapPin, Wrench, Trash2, Filter, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWasteStore } from "@/store/wasteStore";
import { useJobStore } from "@/store/jobStore";
import { useResourceStore } from "@/store/resourceStore";

type MarkerType = "waste" | "job" | "resource" | "need";
type FilterType = "all" | MarkerType;

interface MapMarker {
  id: string;
  title: string;
  type: MarkerType;
  location: string;
  status?: string;
  coordinates?: { lat: number; lng: number };
}

const typeConfig = {
  waste: {
    icon: Trash2,
    label: "จุดขยะ",
    bgColor: "bg-red-500",
    textColor: "text-red-500",
  },
  job: {
    icon: Wrench,
    label: "งานซ่อม",
    bgColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
  resource: {
    icon: Package,
    label: "ทรัพยากร",
    bgColor: "bg-green-500",
    textColor: "text-green-500",
  },
  need: {
    icon: MapPin,
    label: "ความต้องการ",
    bgColor: "bg-orange-500",
    textColor: "text-orange-500",
  },
};

const MapPage = () => {
  const { wasteReports, loadReports: loadWasteReports } = useWasteStore();
  const { jobs, loadJobs } = useJobStore();
  const { resources, needs, loadData: loadResourceData } = useResourceStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    loadWasteReports();
    loadJobs();
    loadResourceData();
  }, [loadWasteReports, loadJobs, loadResourceData]);

  useEffect(() => {
    const allMarkers: MapMarker[] = [];

    // Add waste reports
    wasteReports.forEach((report) => {
      if (filter === "all" || filter === "waste") {
        allMarkers.push({
          id: `waste-${report.id}`,
          title: `ขยะ${report.wasteType === "hazardous" ? "อันตราย" : ""}`,
          type: "waste",
          location: report.location || "ไม่ระบุตำแหน่ง",
          status: report.status,
          coordinates: report.coordinates || undefined,
        });
      }
    });

    // Add jobs
    jobs.forEach((job) => {
      if (filter === "all" || filter === "job") {
        allMarkers.push({
          id: `job-${job.id}`,
          title: job.title,
          type: "job",
          location: job.location || "ไม่ระบุตำแหน่ง",
          status: job.status,
        });
      }
    });

    // Add available resources
    resources.forEach((resource) => {
      if ((filter === "all" || filter === "resource") && resource.status === "available") {
        allMarkers.push({
          id: `resource-${resource.id}`,
          title: resource.name,
          type: "resource",
          location: resource.location,
          status: resource.status,
        });
      }
    });

    // Add needs
    needs.forEach((need) => {
      if ((filter === "all" || filter === "need") && need.status === "pending") {
        allMarkers.push({
          id: `need-${need.id}`,
          title: `ต้องการ${need.requesterName ? ` - ${need.requesterName}` : ""}`,
          type: "need",
          location: need.location,
          status: need.status,
        });
      }
    });

    setMarkers(allMarkers);
  }, [wasteReports, jobs, resources, needs, filter]);

  return (
    <div className="min-h-screen bg-background pb-28">
      <main className="max-w-lg mx-auto">
        {/* Map Placeholder */}
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-blue-300 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">แผนที่หาดใหญ่</p>
              <p className="text-xs text-muted-foreground mt-1">OpenStreetMap จะแสดงที่นี่</p>
            </div>
          </div>

          {/* Mock map markers for visual */}
          {markers.slice(0, 3).map((marker, index) => {
            const config = typeConfig[marker.type];
            const Icon = config.icon;
            const positions = [
              { top: "25%", left: "33%" },
              { top: "50%", right: "25%" },
              { bottom: "25%", left: "50%" },
            ];
            return (
              <div
                key={marker.id}
                className={cn(
                  "absolute w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
                  config.bgColor,
                  index === 0 && "animate-pulse"
                )}
                style={positions[index]}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Button variant="outline" size="sm" className="flex-shrink-0 gap-1.5">
            <Filter className="w-4 h-4" />
            ตัวกรอง
          </Button>
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            ทั้งหมด ({markers.length})
          </Badge>
          <Badge
            variant={filter === "waste" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("waste")}
          >
            จุดขยะ ({wasteReports.length})
          </Badge>
          <Badge
            variant={filter === "job" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("job")}
          >
            งานซ่อม ({jobs.length})
          </Badge>
          <Badge
            variant={filter === "resource" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("resource")}
          >
            ทรัพยากร ({resources.filter((r) => r.status === "available").length})
          </Badge>
          <Badge
            variant={filter === "need" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("need")}
          >
            ความต้องการ ({needs.filter((n) => n.status === "pending").length})
          </Badge>
        </div>

        {/* Nearby List */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            จุดทั้งหมด ({markers.length})
          </h2>

          {markers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">ไม่มีข้อมูลในขณะนี้</p>
            </Card>
          ) : (
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
                          {marker.status && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {marker.status}
                              </Badge>
                            </>
                          )}
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
          )}
        </div>
      </main>
    </div>
  );
};

export default MapPage;
