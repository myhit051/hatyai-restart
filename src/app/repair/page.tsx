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

import LocationPicker from "@/components/LocationPicker";

const RepairDashboard = () => {
    const { user } = useAuthStore();
    const { jobs, createJob, assignJob, updateJobStatus, loadJobs, myJobs, availableJobs } = useJobStore();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        location: "",
        repairType: "other" as RepairType,
        urgency: "medium" as UrgencyLevel,
        estimatedDuration: "",
        coordinates: null as { lat: number; lng: number } | null,
    });

    useEffect(() => {
        if (user) {
            loadJobs(user.id);
        } else {
            loadJobs();
        }
    }, [loadJobs, user]);

    const handleCreateJob = async () => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนสร้างงานซ่อม");
            return;
        }

        try {
            const result = await createJob({
                title: newJob.title,
                description: newJob.description,
                job_type: newJob.repairType as any,
                location: newJob.location,
                urgency: newJob.urgency,
                requester_id: user.id,
                requester_name: user.name,
                coordinates: newJob.coordinates || undefined,
            });

            if (result && result.success) {
                setNewJob({
                    title: "",
                    description: "",
                    location: "",
                    repairType: "other",
                    urgency: "medium",
                    estimatedDuration: "",
                    coordinates: null,
                });
                setIsCreateDialogOpen(false);
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (result?.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error creating job:", error);
            alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "open":
                return <ClockIcon className="h-4 w-4 text-yellow-500" />;
            case "in_progress":
                return <WrenchScrewdriverIcon className="h-4 w-4 text-orange-500" />;
            case "completed":
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            case "cancelled":
                return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
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
                                แจ้งซ่อม
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>แจ้งซ่อม</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">หัวข้อ</Label>
                                    <Input
                                        id="title"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="เช่น ไฟดับ, ท่อน้ำแตก"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="repairType">ประเภทงานซ่อม</Label>
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
                                    <Label htmlFor="description">รายละเอียด</Label>
                                    <Textarea
                                        id="description"
                                        value={newJob.description}
                                        onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="อธิบายปัญหาที่พบ..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location">สถานที่</Label>
                                    <LocationPicker
                                        value={newJob.coordinates}
                                        onChange={(coords) => setNewJob(prev => ({ ...prev, coordinates: coords }))}
                                        addressValue={newJob.location}
                                        onAddressChange={(val) => setNewJob(prev => ({ ...prev, location: val }))}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="urgency">ความเร่งด่วน</Label>
                                    <Select
                                        value={newJob.urgency}
                                        onValueChange={(value: UrgencyLevel) => setNewJob(prev => ({ ...prev, urgency: value }))}
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

                                <Button onClick={handleCreateJob} className="w-full">
                                    ส่งคำขอ
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">งานทั้งหมด</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{jobs.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">งานของฉัน</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {myJobs.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">งานที่รอช่าง</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {availableJobs.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">งานด่วน</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {jobs.filter(job => job.urgency === "critical" || job.urgency === "high").length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Listings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Available Jobs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>งานที่ต้องการความช่วยเหลือ</CardTitle>
                            <CardDescription>งานซ่อมที่ยังไม่มีผู้รับผิดชอบ</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {availableJobs.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    ไม่มีงานที่ต้องการความช่วยเหลือในขณะนี้
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
                                                    <Badge variant={getUrgencyBadgeVariant(job.urgency)}>
                                                        {job.urgency === "critical" && "ด่วนที่สุด"}
                                                        {job.urgency === "high" && "สูง"}
                                                        {job.urgency === "medium" && "ปานกลาง"}
                                                        {job.urgency === "low" && "ต่ำ"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {user && user.role === 'technician' && user.id !== job.requesterId && (
                                                <Button size="sm" onClick={() => assignJob(job.id, user.id)}>
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

                    {/* My Jobs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>งานของฉัน</CardTitle>
                            <CardDescription>งานที่คุณแจ้งหรือรับผิดชอบ</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {myJobs.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    คุณยังไม่มีงานที่เกี่ยวข้อง
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
                                                    <Badge variant={getUrgencyBadgeVariant(job.urgency)}>
                                                        {job.urgency === "critical" && "ด่วนที่สุด"}
                                                        {job.urgency === "high" && "สูง"}
                                                        {job.urgency === "medium" && "ปานกลาง"}
                                                        {job.urgency === "low" && "ต่ำ"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {user && job.assignedTo === user.id && job.status !== "completed" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateJobStatus(job.id, "completed")}
                                                >
                                                    ปิดงาน
                                                </Button>
                                            )}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            📍 {job.location} • 👤 {job.requesterName}
                                        </div>

                                        {job.assignedTechnicianName && (
                                            <div className="text-xs text-blue-600">
                                                🛠️ ผู้รับงาน: {job.assignedTechnicianName}
                                            </div>
                                        )}
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
