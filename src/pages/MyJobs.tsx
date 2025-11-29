import { ClipboardList, MapPin, Clock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface JobItem {
  id: string;
  title: string;
  location: string;
  status: "pending" | "in-progress" | "completed";
  type: "help" | "waste" | "donation";
  date: string;
}

const myJobs: JobItem[] = [
  {
    id: "1",
    title: "ต้องการช่างไฟฟ้าซ่อมปลั๊ก",
    location: "บ้านเลขที่ 42 ซอยเพชรเกษม 3",
    status: "in-progress",
    type: "help",
    date: "28 พ.ย. 2568",
  },
  {
    id: "2",
    title: "แจ้งขยะตู้เย็นเสีย",
    location: "หน้าบ้าน ซอย 5",
    status: "pending",
    type: "waste",
    date: "27 พ.ย. 2568",
  },
  {
    id: "3",
    title: "บริจาคเสื้อผ้า 20 ชิ้น",
    location: "ศูนย์พักพิงชั่วคราว",
    status: "completed",
    type: "donation",
    date: "26 พ.ย. 2568",
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

const typeConfig = {
  help: { label: "ขอความช่วยเหลือ", color: "text-primary" },
  waste: { label: "แจ้งขยะ", color: "text-alert" },
  donation: { label: "บริจาค", color: "text-success" },
};

const JobCard = ({ job }: { job: JobItem }) => {
  const status = statusConfig[job.status];
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
        <span className="truncate">{job.location}</span>
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

const MyJobs = () => {
  const activeJobs = myJobs.filter((j) => j.status !== "completed");
  const completedJobs = myJobs.filter((j) => j.status === "completed");

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-5">
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

      <BottomNav />
    </div>
  );
};

export default MyJobs;
