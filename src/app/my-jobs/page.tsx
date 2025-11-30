"use client";
import { useEffect, useState } from "react";
import { ClipboardList, MapPin, Clock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useJobStore } from "@/store/jobStore";
import { useWasteStore } from "@/store/wasteStore";
import { useResourceStore } from "@/store/resourceStore";

interface JobItem {
    id: string;
    title: string;
    location: string;
    status: string;
    type: "help" | "waste" | "donation" | "need";
    date: string;
    originalData?: any;
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

const typeConfig = {
    help: { label: "งานซ่อม", color: "text-blue-500" },
    waste: { label: "แจ้งขยะ", color: "text-red-500" },
    donation: { label: "บริจาค", color: "text-green-500" },
    need: { label: "ขอความช่วยเหลือ", color: "text-orange-500" },
};

const JobCard = ({ job }: { job: JobItem }) => {
    const status = statusConfig[job.status] || { label: job.status, className: "bg-gray-100 text-gray-500" };
    const type = typeConfig[job.type];

    return (
        <Card className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all cursor-pointer active:scale-[0.98]">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                    <p className={cn("text-xs font-medium mb-1", type.color)}>{type.label}</p>
                    <h3 className="font-medium text-foreground">{job.title}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{job.location || "ไม่ระบุตำแหน่ง"}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{job.date}</span>
                </div>
                <Badge variant="outline" className={cn("text-xs font-medium", status.className)}>
                    {status.label}
                </Badge>
            </div>
        </Card>
    );
};

const MyJobsPage = () => {
    const { user } = useAuthStore();
    const { myJobs: repairJobs, loadJobs } = useJobStore();
    const { myReports: wasteReports, loadReports } = useWasteStore();
    const { resources, needs, loadData: loadResourceData } = useResourceStore();
    const [allJobs, setAllJobs] = useState<JobItem[]>([]);

    useEffect(() => {
        if (user) {
            loadJobs(user.id);
            loadReports(user.id);
            loadResourceData();
        }
    }, [user, loadJobs, loadReports, loadResourceData]);

    useEffect(() => {
        if (!user) return;

        const jobs: JobItem[] = [];

        // 1. Repair Jobs
        repairJobs.forEach(job => {
            jobs.push({
                id: `repair-${job.id}`,
                title: job.title,
                location: job.location || "ไม่ระบุตำแหน่ง",
                status: job.status,
                type: "help",
                date: new Date(job.createdAt).toLocaleDateString('th-TH'),
                originalData: job
            });
        });

        // 2. Waste Reports
        wasteReports.forEach(report => {
            jobs.push({
                id: `waste-${report.id}`,
                title: `แจ้งขยะ: ${report.wasteType}`,
                location: report.location || "ไม่ระบุตำแหน่ง",
                status: report.status,
                type: "waste",
                date: new Date(report.createdAt).toLocaleDateString('th-TH'),
                originalData: report
            });
        });

        // 3. Donations (Resources)
        const myDonations = resources.filter(r => r.donorId === user.id);
        myDonations.forEach(donation => {
            jobs.push({
                id: `donation-${donation.id}`,
                title: `บริจาค: ${donation.name}`,
                location: donation.location || "ไม่ระบุตำแหน่ง",
                status: donation.status,
                type: "donation",
                date: new Date(donation.createdAt).toLocaleDateString('th-TH'),
                originalData: donation
            });
        });

        // 4. Needs
        const myNeeds = needs.filter(n => n.requesterId === user.id);
        myNeeds.forEach(need => {
            jobs.push({
                id: `need-${need.id}`,
                title: `ขอความช่วยเหลือ: ${need.resourceType}`,
                location: need.location || "ไม่ระบุตำแหน่ง",
                status: need.status,
                type: "need",
                date: new Date(need.createdAt).toLocaleDateString('th-TH'),
                originalData: need
            });
        });

        // Sort by date desc
        jobs.sort((a, b) => new Date(b.originalData.createdAt).getTime() - new Date(a.originalData.createdAt).getTime());

        setAllJobs(jobs);
    }, [user, repairJobs, wasteReports, resources, needs]);

    const activeJobs = allJobs.filter((j) => !['completed', 'cancelled', 'cleared', 'distributed', 'fulfilled'].includes(j.status));
    const completedJobs = allJobs.filter((j) => ['completed', 'cancelled', 'cleared', 'distributed', 'fulfilled'].includes(j.status));

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>กรุณาเข้าสู่ระบบ...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-28">
            <main className="max-w-lg md:max-w-4xl mx-auto px-4 py-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">งานของฉัน</h1>
                        <p className="text-sm text-muted-foreground">ติดตามสถานะคำขอทั้งหมด</p>
                    </div>
                </div>

                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="w-full mb-4 bg-secondary">
                        <TabsTrigger value="active" className="flex-1">
                            กำลังดำเนินการ ({activeJobs.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="flex-1">
                            เสร็จสิ้น ({completedJobs.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-3 animate-fade-in">
                        {activeJobs.length > 0 ? (
                            activeJobs.map((job) => <JobCard key={job.id} job={job} />)
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>ไม่มีงานที่กำลังดำเนินการ</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-3 animate-fade-in">
                        {completedJobs.length > 0 ? (
                            completedJobs.map((job) => <JobCard key={job.id} job={job} />)
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>ยังไม่มีงานที่เสร็จสิ้น</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default MyJobsPage;
