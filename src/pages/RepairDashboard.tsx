"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useJobStore } from "@/store/jobStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RepairType, UrgencyLevel } from "@/store/jobStore";
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const RepairDashboard = () => {
  const { user } = useAuthStore();
  const { jobs, createJob, assignJob, updateJobStatus, loadJobs, myJobs, availableJobs } = useJobStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    repairType: "other" as RepairType,
    urgencyLevel: "medium" as UrgencyLevel,
    estimatedDuration: ""
  });

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleCreateJob = async () => {
    await createJob(newJob);
    setNewJob({
      title: "",
      description: "",
      location: "",
      repairType: "other",
      urgencyLevel: "medium",
      estimatedDuration: ""
    });
    setIsCreateDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "assigned":
        return <ExclamationTriangleIcon className="h-4 w-4 text-blue-500" />;
      case "in-progress":
        return <WrenchScrewdriverIcon className="h-4 w-4 text-orange-500" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const repairTypeOptions = [
    { value: "electrical", label: "ไฟฟ้า" },
    { value: "plumbing", label: "ประปา" },
    { value: "carpentry", label: "ไม้/เฟอร์นิเจอร์" },
    { value: "painting", label: "ทาสี" },
    { value: "cleaning", label: "ทำความสะอาด" },
    { value: "other", label: "อื่นๆ" }
  ];

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ศูนย์ซ่อมแซม</h1>
            <p className="text-muted-foreground">จัดการคำขอซ่อมแซมและค้นหาช่างผู้เชี่ยวชาญ</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                สร้างคำขอซ่อม
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>สร้างคำขอซ่อมใหม่</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">หัวข้อ</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="เช่น ซ่อมปั๊มน้ำเสีย"
                  />
                </div>

                <div>
                  <Label htmlFor="description">รายละเอียด</Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="อธิบายปัญหาที่เกิดขึ้น..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="location">สถานที่</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="ที่อยู่ หรือพื้นที่ที่ต้องการซ่อม"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="repairType">ประเภทการซ่อม</Label>
                    <Select
                      value={newJob.repairType}
                      onValueChange={(value: RepairType) => setNewJob(prev => ({ ...prev, repairType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {repairTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="urgency">ความเร่งด่วน</Label>
                    <Select
                      value={newJob.urgencyLevel}
                      onValueChange={(value: UrgencyLevel) => setNewJob(prev => ({ ...prev, urgencyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">ต่ำ</SelectItem>
                        <SelectItem value="medium">ปานกลาง</SelectItem>
                        <SelectItem value="high">สูง</SelectItem>
                        <SelectItem value="critical">ด่วนที่สุด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">ระยะเวลาโดยประมาณ</Label>
                  <Input
                    id="duration"
                    value={newJob.estimatedDuration}
                    onChange={(e) => setNewJob(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    placeholder="เช่น 2-3 ชั่วโมง"
                  />
                </div>

                <Button onClick={handleCreateJob} className="w-full">
                  สร้างคำขอ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">คำขอทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">รอดำเนินการ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {jobs.filter(job => job.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">กำลังดำเนินการ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {jobs.filter(job => job.status === "in-progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {jobs.filter(job => job.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>คำขอของฉัน</CardTitle>
              <CardDescription>คำขอซ่อมที่คุณสร้างหรือได้รับมอบหมาย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  ไม่มีคำขอของคุณในขณะนี้
                </p>
              ) : (
                myJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(job.status)}
                          <Badge variant={getUrgencyBadgeVariant(job.urgencyLevel)}>
                            {job.urgencyLevel === "critical" && "ด่วนที่สุด"}
                            {job.urgencyLevel === "high" && "สูง"}
                            {job.urgencyLevel === "medium" && "ปานกลาง"}
                            {job.urgencyLevel === "low" && "ต่ำ"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      📍 {job.location}
                    </div>

                    {job.assignedTechnicianName && (
                      <div className="text-xs text-muted-foreground">
                        ช่าง: {job.assignedTechnicianName}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Available Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>คำขอที่รอช่าง</CardTitle>
              <CardDescription>คำขอซ่อมที่รอการมอบหมายให้ช่าง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  ไม่มีคำขอที่รอดำเนินการในขณะนี้
                </p>
              ) : (
                availableJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(job.status)}
                          <Badge variant={getUrgencyBadgeVariant(job.urgencyLevel)}>
                            {job.urgencyLevel === "critical" && "ด่วนที่สุด"}
                            {job.urgencyLevel === "high" && "สูง"}
                            {job.urgencyLevel === "medium" && "ปานกลาง"}
                            {job.urgencyLevel === "low" && "ต่ำ"}
                          </Badge>
                        </div>
                      </div>

                      {user?.role === 'technician' && (
                        <Button
                          size="sm"
                          onClick={() => assignJob(job.id, user.id)}
                        >
                          รับงาน
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      📍 {job.location} • 👤 {job.requesterName}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RepairDashboard;