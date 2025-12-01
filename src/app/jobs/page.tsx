"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPinIcon,
  DollarSignIcon,
  UserIcon,
  SearchIcon,
  Filter,
  CalendarIcon
} from "lucide-react";
import {
  getGeneralJobs,
  getJobCategories,
  GeneralJob,
  JobCategory,
} from "@/app/actions/general-jobs";
import {
  getJobs,
  Job
} from "@/app/actions/jobs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UniversalDetailModal } from "@/components/UniversalDetailModal";
import { useAuthStore } from "@/store/authStore";

const POSTING_TYPES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "hiring", label: "หาคนทำงาน" },
  { value: "seeking", label: "หางานทำ" },
] as const;

const URGENCY_COLORS = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
} as const;

const POSTING_TYPE_COLORS = {
  hiring: "bg-blue-100 text-blue-800",
  seeking: "bg-purple-100 text-purple-800",
} as const;

interface JobCardProps {
  job: GeneralJob;
  showContact?: boolean;
  onShowContact?: () => void;
  onViewDetails: (job: GeneralJob) => void;
  isAuthenticated: boolean;
}

function GeneralJobCard({ job, showContact, onShowContact, onViewDetails, isAuthenticated }: JobCardProps) {
  const formatWage = () => {
    if (!job.wage_amount || job.wage_type === "negotiable") {
      return job.wage_type === "negotiable" ? "ตกลงกันได้" : "ไม่ระบุ";
    }

    const wageText = `${job.wage_amount.toLocaleString()} บาท`;
    const unitMap = {
      daily: "/วัน",
      hourly: "/ชั่วโมง",
      per_project: "/ครั้ง",
      negotiable: ""
    };

    return `${wageText}${unitMap[job.wage_type as keyof typeof unitMap] || ""}`;
  };

  const isExpired = job.expires_at && new Date(job.expires_at) < new Date();

  return (
    <Card className={`hover:shadow-md transition-shadow ${isExpired ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={POSTING_TYPE_COLORS[job.posting_type]}>
                {job.posting_type === "hiring" ? "หาคนทำ" : "หางานทำ"}
              </Badge>
              {job.category_name && (
                <Badge variant="outline">{job.category_name}</Badge>
              )}
              {isExpired && <Badge variant="destructive">หมดอายุ</Badge>}
            </div>
            <CardTitle className="text-lg mb-1 line-clamp-2">{job.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {job.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserIcon className="h-4 w-4" />
          <span>{isAuthenticated ? (job.employer_name || job.seeker_name || "ไม่ระบุชื่อ") : "เข้าสู่ระบบเพื่อดูชื่อ"}</span>
        </div>

        {job.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
        )}

        {(job.wage_amount || job.wage_type === "negotiable") && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSignIcon className="h-4 w-4" />
            <span className="font-medium">{formatWage()}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(job.created_at).toLocaleDateString('th-TH')}</span>
          </div>

          <Badge className={URGENCY_COLORS[job.urgency]} variant="secondary">
            {job.urgency === "low" && "ไม่ด่วน"}
            {job.urgency === "medium" && "ปานกลาง"}
            {job.urgency === "high" && "ด่วน"}
            {job.urgency === "urgent" && "ด่วนมาก"}
          </Badge>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(job)}
            className="flex-1"
          >
            ดูรายละเอียด
          </Button>

          {!isExpired && showContact && (
            <Button
              size="sm"
              onClick={onShowContact}
              className="flex-1"
            >
              ติดต่อ
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface RepairJobCardProps {
  job: Job;
  onAssign?: () => void;
  onViewDetails: (job: Job) => void;
  isAuthenticated: boolean;
}

function RepairJobCard({ job, onAssign, onViewDetails, isAuthenticated }: RepairJobCardProps) {
  const getJobTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      electric: "ไฟฟ้า",
      plumbing: "ประปา",
      structure: "โครงสร้าง",
      cleaning: "ทำความสะอาด",
      other: "อื่นๆ"
    };
    return typeMap[type] || type;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="destructive">งานซ่อม</Badge>
          <Badge variant="outline">{getJobTypeLabel(job.job_type)}</Badge>
          {job.status === "open" && (
            <Badge className="bg-green-100 text-green-800">รับสมัคร</Badge>
          )}
        </div>
        <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
        <CardDescription>{job.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserIcon className="h-4 w-4" />
          <span>{isAuthenticated ? (job.requester_name || "ไม่ระบุชื่อ") : "เข้าสู่ระบบเพื่อดูชื่อ"}</span>
        </div>

        {job.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(job.created_at).toLocaleDateString('th-TH')}</span>
          </div>

          <Badge variant="secondary">
            {job.urgency === "low" && "ไม่ด่วน"}
            {job.urgency === "medium" && "ปานกลาง"}
            {job.urgency === "high" && "ด่วน"}
            {job.urgency === "critical" && "ด่วนมาก"}
          </Badge>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(job)}
            className="flex-1"
          >
            ดูรายละเอียด
          </Button>

          {job.status === "open" && onAssign && (
            <Button
              size="sm"
              onClick={onAssign}
              className="flex-1"
            >
              รับงานนี้
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [generalJobs, setGeneralJobs] = useState<GeneralJob[]>([]);
  const [repairJobs, setRepairJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Dialog State
  const [selectedJob, setSelectedJob] = useState<GeneralJob | Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [postingTypeFilter, setPostingTypeFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    loadData();

    // Set active tab from URL parameter
    const tab = searchParams?.get('tab');
    if (tab === 'repair' || tab === 'general' || tab === 'all') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [generalJobsData, repairJobsData, categoriesData] = await Promise.all([
        getGeneralJobs(),
        getJobs(),
        getJobCategories(),
      ]);

      setGeneralJobs(generalJobsData);
      setRepairJobs(repairJobsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGeneralJobs = generalJobs.filter(job => {
    if (postingTypeFilter !== "all" && job.posting_type !== postingTypeFilter) return false;
    if (categoryFilter && job.category_id !== categoryFilter) return false;
    if (urgencyFilter && urgencyFilter !== "all" && job.urgency !== urgencyFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        (job.description && job.description.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const filteredRepairJobs = repairJobs.filter(job => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        (job.description && job.description.toLowerCase().includes(query)) ||
        (job.location && job.location.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleShowContact = async (jobId: string) => {
    // Here we would implement the contact logic
    // For now, just show a success message
    alert("ข้อมูลติดต่อจะถูกแสดงหลังจากยืนยันตัวตน");
  };

  const handleViewDetails = (job: GeneralJob | Job) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const updateUrl = (newParams: Record<string, string>) => {
    const current = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    const newUrl = current.toString() ? `?${current.toString()}` : '';
    router.replace(`/jobs${newUrl}`, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrl({ search: value, tab: activeTab });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateUrl({ tab: value, search: searchQuery });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">รายการงาน</h1>
        <p className="text-gray-600">หางานทั่วไปและงานซ่อมในพื้นที่หาดใหญ่</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ค้นหางาน, ทักษะ, หรือสถานที่..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Filter className="h-4 w-4" />
                    ตัวกรอง
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>ตัวกรองค้นหา</SheetTitle>
                    <SheetDescription>
                      เลือกเงื่อนไขเพื่อค้นหางานที่ต้องการ
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ประเภทการโพสต์</label>
                      <Select value={postingTypeFilter} onValueChange={setPostingTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="ประเภทการโพสต์" />
                        </SelectTrigger>
                        <SelectContent>
                          {POSTING_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">ความเร่งด่วน</label>
                      <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="ความเร่งด่วน" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">ทุกระดับ</SelectItem>
                          <SelectItem value="low">ไม่ด่วน</SelectItem>
                          <SelectItem value="medium">ปานกลาง</SelectItem>
                          <SelectItem value="high">ด่วน</SelectItem>
                          <SelectItem value="urgent">ด่วนมาก</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' }))}>
                      ดูผลลัพธ์
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-4">
              <div className="w-[180px]">
                <Select value={postingTypeFilter} onValueChange={setPostingTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="ประเภทการโพสต์" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSTING_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="ความเร่งด่วน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกระดับ</SelectItem>
                    <SelectItem value="low">ไม่ด่วน</SelectItem>
                    <SelectItem value="medium">ปานกลาง</SelectItem>
                    <SelectItem value="high">ด่วน</SelectItem>
                    <SelectItem value="urgent">ด่วนมาก</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="general">งานทั่วไป</TabsTrigger>
            <TabsTrigger value="repair">งานซ่อม</TabsTrigger>
          </TabsList>

          <Button
            onClick={() => {
              if (!isAuthenticated) {
                router.push('/login');
              } else {
                router.push('/create-job');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            โพสต์หางาน
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-8">
            {filteredGeneralJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">งานทั่วไป ({filteredGeneralJobs.length})</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredGeneralJobs.map((job) => (
                    <GeneralJobCard
                      key={job.id}
                      job={job}
                      showContact={true}
                      onShowContact={() => handleShowContact(job.id)}
                      onViewDetails={handleViewDetails}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredRepairJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">งานซ่อม/ล้าง/ขนย้าย ({filteredRepairJobs.length})</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRepairJobs.map((job) => (
                    <RepairJobCard
                      key={job.id}
                      job={job}
                      onViewDetails={handleViewDetails}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="general" className="mt-0">
          {filteredGeneralJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGeneralJobs.map((job) => (
                <GeneralJobCard
                  key={job.id}
                  job={job}
                  showContact={true}
                  onShowContact={() => handleShowContact(job.id)}
                  onViewDetails={handleViewDetails}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบงานทั่วไปที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="repair" className="mt-0">
          {filteredRepairJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRepairJobs.map((job) => (
                <RepairJobCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewDetails}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบงานซ่อมที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <UniversalDetailModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        type="job"
        data={selectedJob}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
}