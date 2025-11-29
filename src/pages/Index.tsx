import Header from "@/components/Header";
import StatusCard from "@/components/StatusCard";
import ActionGrid from "@/components/ActionGrid";
import RecentActivity from "@/components/RecentActivity";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />
      
      <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {/* Hero Status Section */}
        <StatusCard userName="สมชาย" />
        
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
      
      <BottomNav />
    </div>
  );
};

export default Index;
