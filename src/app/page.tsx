"use client";

import StatusCard from "@/components/StatusCard";
import ActionGrid from "@/components/ActionGrid";
import RecentActivity from "@/components/RecentActivity";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-background pb-28">
            <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
                {/* Hero Status Section */}
                <StatusCard userName={user?.name || "ผู้มาเยือน"} />

                {/* Main Action Grid */}
                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                        ฉันต้องการ...
                    </h2>
                    <ActionGrid />
                </section>

                {/* Recent Activity */}
                <RecentActivity />
            </main>
        </div>
    );
}
