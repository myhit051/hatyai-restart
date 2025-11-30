"use client";
import { useEffect, useState } from "react";
import StatusCard from "@/components/StatusCard";
import ActionGrid from "@/components/ActionGrid";
import RecentActivity, { ActivityItem } from "@/components/RecentActivity";
import { useAuthStore } from "@/store/authStore";
import { useJobStore } from "@/store/jobStore";
import { useWasteStore } from "@/store/wasteStore";
import { useResourceStore } from "@/store/resourceStore";

const IndexPage = () => {
    const { user } = useAuthStore();
    const { myJobs, jobs, loadJobs } = useJobStore();
    const { myReports, wasteReports, loadReports } = useWasteStore();
    const { resources, needs, loadData } = useResourceStore();
    const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

    useEffect(() => {
        loadJobs();
        loadReports();
        loadData();
    }, [loadJobs, loadReports, loadData]);

    useEffect(() => {
        // Combine recent activities from all sources
        const allItems = [
            ...jobs.map(j => ({ ...j, type: 'job', displayTitle: j.title })),
            ...wasteReports.map(w => ({ ...w, type: 'waste', displayTitle: `แจ้งขยะ: ${w.wasteType}` })),
            ...needs.map(n => ({ ...n, type: 'need', displayTitle: `ต้องการ: ${n.resourceType}` }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

        const mappedActivities: ActivityItem[] = allItems.map(item => ({
            id: `${item.type}-${item.id}`,
            title: item.displayTitle,
            location: item.location || "ไม่ระบุตำแหน่ง",
            status: item.status,
            time: new Date(item.createdAt).toLocaleDateString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'short'
            })
        }));

        setRecentActivities(mappedActivities);

    }, [jobs, wasteReports, needs]);

    const activeJobsCount = (myJobs?.length || 0) + (myReports?.length || 0);
    const myDonationsCount = resources.filter(r => r.donorId === user?.id).length;

    return (
        <div className="min-h-screen bg-background pb-28">
            <main className="max-w-lg md:max-w-4xl mx-auto px-4 py-5 space-y-6">
                {/* Hero Status Section */}
                <StatusCard
                    userName={user?.name || "ผู้เยี่ยมชม"}
                    activeJobsCount={activeJobsCount}
                    donationsCount={myDonationsCount}
                />

                {/* Main Action Grid */}
                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                        ฉันต้องการ...
                    </h2>
                    <ActionGrid />
                </section>

                {/* Recent Activity */}
                <RecentActivity activities={recentActivities} />
            </main>
        </div>
    );
};

export default IndexPage;
