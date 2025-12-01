"use client";
import { useEffect, useState } from "react";
import { Map, MapPin, Wrench, Trash2, Filter, Package, List } from "lucide-react";
import MapWrapper from "@/components/MapWrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWasteStore } from "@/store/wasteStore";
import { useJobStore } from "@/store/jobStore";
import { useResourceStore } from "@/store/resourceStore";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerDescription,
} from "@/components/ui/drawer";

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
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
                    coordinates: job.coordinates || undefined,
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
                    coordinates: resource.coordinates || undefined,
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
                    coordinates: need.coordinates || undefined,
                });
            }
        });

        setMarkers(allMarkers);
    }, [wasteReports, jobs, resources, needs, filter]);

    return (
        <div className="h-[calc(100vh-64px)] bg-background relative flex flex-col">
            {/* Filter Bar - Fixed Top */}
            <div className="px-4 py-3 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center gap-2 overflow-x-auto scrollbar-hide z-10 shadow-sm">
                <Button variant="outline" size="sm" className="flex-shrink-0 gap-1.5 h-8">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">ตัวกรอง</span>
                </Button>
                <Badge
                    variant={filter === "all" ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap h-7"
                    onClick={() => setFilter("all")}
                >
                    ทั้งหมด ({markers.length})
                </Badge>
                <Badge
                    variant={filter === "waste" ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap h-7"
                    onClick={() => setFilter("waste")}
                >
                    จุดขยะ ({wasteReports.length})
                </Badge>
                <Badge
                    variant={filter === "job" ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap h-7"
                    onClick={() => setFilter("job")}
                >
                    งานซ่อม ({jobs.length})
                </Badge>
                <Badge
                    variant={filter === "resource" ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap h-7"
                    onClick={() => setFilter("resource")}
                >
                    ทรัพยากร ({resources.filter((r) => r.status === "available").length})
                </Badge>
                <Badge
                    variant={filter === "need" ? "default" : "outline"}
                    className="cursor-pointer whitespace-nowrap h-7"
                    onClick={() => setFilter("need")}
                >
                    ความต้องการ ({needs.filter((n) => n.status === "pending").length})
                </Badge>
            </div>

            {/* Map Area - Fills remaining space */}
            <div className="flex-1 relative w-full overflow-hidden">
                <MapWrapper items={markers} />

                {/* Floating List Button */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <DrawerTrigger asChild>
                            <Button className="rounded-full shadow-lg px-6 gap-2" size="lg">
                                <List className="w-5 h-5" />
                                แสดงรายการ ({markers.length})
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-[80vh]">
                            <DrawerHeader>
                                <DrawerTitle>รายการจุดทั้งหมด ({markers.length})</DrawerTitle>
                                <DrawerDescription>
                                    แสดงรายการจุดที่พบในแผนที่ตามตัวกรองปัจจุบัน
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4 pb-8 overflow-y-auto h-full">
                                {markers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">ไม่มีข้อมูลในขณะนี้</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {markers.map((marker, index) => {
                                            const config = typeConfig[marker.type];
                                            const Icon = config.icon;

                                            return (
                                                <Card
                                                    key={marker.id}
                                                    className={cn(
                                                        "p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all cursor-pointer active:scale-[0.98]"
                                                    )}
                                                    onClick={() => {
                                                        // Optional: Center map on click (would need callback to MapWrapper)
                                                        setIsDrawerOpen(false);
                                                    }}
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
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
