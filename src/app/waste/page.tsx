"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useWasteStore } from "@/store/wasteStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WasteType, WasteStatus } from "@/store/wasteStore";
import LocationPicker from "@/components/LocationPicker";
import {
    TrashIcon,
    PlusIcon,
    MapPinIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";

const WasteDashboard = () => {
    const { user } = useAuthStore();
    const { wasteReports, createReport, updateStatus, loadReports, myReports, activeReports } = useWasteStore();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newReport, setNewReport] = useState({
        location: "",
        wasteType: "mixed" as WasteType,
        description: "",
        severity: "medium" as "low" | "medium" | "high",
        coordinates: null as { lat: number; lng: number } | null,
    });

    useEffect(() => {
        if (user) {
            loadReports(user.id);
        } else {
            loadReports();
        }
    }, [loadReports, user]);

    const handleCreateReport = async () => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนรายงานขยะ");
            return;
        }

        try {
            const result = await createReport({
                reporter_id: user.id,
                reporter_name: user.name,
                waste_type: newReport.wasteType,
                description: newReport.description,
                location: newReport.location,
                severity: newReport.severity,
                coordinates: newReport.coordinates || undefined,
            });

            if (result && result.success) {
                setNewReport({
                    location: "",
                    wasteType: "mixed",
                    description: "",
                    severity: "medium",
                    coordinates: null,
                });
                setIsCreateDialogOpen(false);
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (result?.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error creating report:", error);
            alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
        }
    };

    const handleUpdateStatus = async (reportId: string, status: WasteStatus) => {
        await updateStatus(reportId, status);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "reported":
                return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
            case "acknowledged":
                return <MapPinIcon className="h-4 w-4 text-blue-500" />;
            case "in_progress":
                return <TruckIcon className="h-4 w-4 text-orange-500" />;
            case "cleared":
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            default:
                return <TrashIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    const getRiskBadgeVariant = (severity: string) => {
        switch (severity) {
            case "low":
                return "secondary";
            case "medium":
                return "default";
            case "high":
                return "destructive";
            default:
                return "secondary";
        }
    };

    const wasteTypeOptions: { value: WasteType; label: string }[] = [
        { value: "construction", label: "วัสดุก่อสร้าง" },
        { value: "hazardous", label: "ขยะอันตราย" },
        { value: "organic", label: "ขยะอินทรีย์" },
        { value: "plastic", label: "พลาสติก" },
        { value: "mixed", label: "ขยะผสม/ทั่วไป" },
    ];

    return (
        <div className="min-h-screen bg-background">

            <div className="max-w-6xl mx-auto p-4 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">แจ้งจุดขยะ</h1>
                        <p className="text-muted-foreground">รายงานและติดตามการกำจัดขยะในพื้นที่</p>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                แจ้งจุดขยะ
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>แจ้งจุดขยะ</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="location">สถานที่</Label>
                                    <LocationPicker
                                        value={newReport.coordinates}
                                        onChange={(coords) => setNewReport(prev => ({ ...prev, coordinates: coords }))}
                                        addressValue={newReport.location}
                                        onAddressChange={(val) => setNewReport(prev => ({ ...prev, location: val }))}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="wasteType">ประเภทขยะ</Label>
                                    <Select
                                        value={newReport.wasteType}
                                        onValueChange={(value: WasteType) => setNewReport(prev => ({ ...prev, wasteType: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wasteTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
                                    <Textarea
                                        id="description"
                                        value={newReport.description}
                                        onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="อธิบายลักษณะขยะ ปริมาณ หรือจุดสังเกต..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="severity">ระดับความรุนแรง/ผลกระทบ</Label>
                                    <Select
                                        value={newReport.severity}
                                        onValueChange={(value: "low" | "medium" | "high") => setNewReport(prev => ({ ...prev, severity: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">ต่ำ (ไม่กีดขวาง/ไม่อันตราย)</SelectItem>
                                            <SelectItem value="medium">ปานกลาง (เริ่มส่งกลิ่น/กีดขวาง)</SelectItem>
                                            <SelectItem value="high">สูง (อันตราย/กีดขวางจราจร)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button onClick={handleCreateReport} className="w-full" variant="destructive">
                                    แจ้งจุดขยะ
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">รายงานทั้งหมด</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{wasteReports.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">รอการจัดการ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {activeReports.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">กำจัดแล้ว</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {wasteReports.filter(r => r.status === 'cleared').length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">จุดเสี่ยงสูง</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {wasteReports.filter(r => r.severity === 'high' && r.status !== 'cleared').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Reports List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Reports */}
                    <Card>
                        <CardHeader>
                            <CardTitle>จุดขยะที่รอการจัดการ</CardTitle>
                            <CardDescription>รายงานที่ยังไม่ได้รับการแก้ไข</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {activeReports.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    ไม่มีจุดขยะตกค้างในขณะนี้
                                </p>
                            ) : (
                                activeReports.map((report) => (
                                    <div key={report.id} className="border rounded-lg p-4 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">
                                                        {wasteTypeOptions.find(opt => opt.value === report.wasteType)?.label || report.wasteType}
                                                    </h3>
                                                    <Badge variant={getRiskBadgeVariant(report.severity)}>
                                                        {report.severity === "high" && "ความเสี่ยงสูง"}
                                                        {report.severity === "medium" && "ปานกลาง"}
                                                        {report.severity === "low" && "ต่ำ"}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                    {report.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {getStatusIcon(report.status)}
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        {report.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>

                                            {user && user.role === 'coordinator' && (
                                                <div className="flex flex-col gap-2">
                                                    {report.status === 'reported' && (
                                                        <Button size="sm" onClick={() => handleUpdateStatus(report.id, 'acknowledged')}>
                                                            รับเรื่อง
                                                        </Button>
                                                    )}
                                                    {report.status === 'acknowledged' && (
                                                        <Button size="sm" onClick={() => handleUpdateStatus(report.id, 'in_progress')}>
                                                            เริ่มดำเนินการ
                                                        </Button>
                                                    )}
                                                    {report.status === 'in_progress' && (
                                                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(report.id, 'cleared')}>
                                                            เสร็จสิ้น
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            📍 {report.location} • 👤 {report.reporterName}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* My Reports */}
                    <Card>
                        <CardHeader>
                            <CardTitle>รายงานของฉัน</CardTitle>
                            <CardDescription>ประวัติการแจ้งจุดขยะของคุณ</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {myReports.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    คุณยังไม่เคยแจ้งจุดขยะ
                                </p>
                            ) : (
                                myReports.map((report) => (
                                    <div key={report.id} className="border rounded-lg p-4 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">
                                                        {wasteTypeOptions.find(opt => opt.value === report.wasteType)?.label || report.wasteType}
                                                    </h3>
                                                    <Badge variant={getRiskBadgeVariant(report.severity)}>
                                                        {report.severity === "high" && "ความเสี่ยงสูง"}
                                                        {report.severity === "medium" && "ปานกลาง"}
                                                        {report.severity === "low" && "ต่ำ"}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                    {report.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {getStatusIcon(report.status)}
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        {report.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            📍 {report.location} • 📅 {new Date(report.createdAt).toLocaleDateString('th-TH')}
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

export default WasteDashboard;
