"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { UniversalDetailModal } from "@/components/UniversalDetailModal";
import ImageUpload from "@/components/ui/image-upload";

const WasteDashboard = () => {
    const { user } = useAuthStore();
    const router = useRouter();
    const { wasteReports, createReport, updateStatus, loadReports, myReports, activeReports } = useWasteStore();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newReport, setNewReport] = useState({
        location: "",
        wasteType: "mixed" as WasteType,
        description: "",
        severity: "medium" as "low" | "medium" | "high",
        coordinates: null as { lat: number; lng: number } | null,
        images: [] as string[],
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
                image_url: newReport.images.length > 0 ? newReport.images[0] : undefined,
            });

            if (result && result.success) {
                setNewReport({
                    location: "",
                    wasteType: "mixed",
                    description: "",
                    severity: "medium",
                    coordinates: null,
                    images: [],
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

    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleViewDetails = (report: any) => {
        setSelectedReport(report);
        setIsDetailOpen(true);
    };

    return (
        <div className="min-h-screen bg-background">

            <div className="max-w-6xl mx-auto p-4 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">แจ้งจุดขยะ</h1>
                        <p className="text-muted-foreground">รายงานและติดตามการกำจัดขยะในพื้นที่</p>
                    </div>

                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (!user) {
                                router.push('/login');
                            } else {
                                setIsCreateDialogOpen(true);
                            }
                        }}
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        แจ้งจุดขยะ
                    </Button>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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

                                <div>
                                    <Label>รูปภาพประกอบ</Label>
                                    <div className="mt-2">
                                        <ImageUpload
                                            value={newReport.images}
                                            onChange={(urls) => setNewReport(prev => ({ ...prev, images: urls }))}
                                            onRemove={(url) => setNewReport(prev => ({ ...prev, images: prev.images.filter(current => current !== url) }))}
                                        />
                                    </div>
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
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">จุดขยะที่รอการจัดการ</h2>
                        {activeReports.length === 0 ? (
                            <Card className="p-8 text-center text-muted-foreground">
                                ไม่มีจุดขยะตกค้างในขณะนี้
                            </Card>
                        ) : (
                            activeReports.map((report) => (
                                <Card key={report.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="destructive">แจ้งจุดขยะ</Badge>
                                                    <Badge variant="outline">
                                                        {wasteTypeOptions.find(opt => opt.value === report.wasteType)?.label || report.wasteType}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg mb-1 line-clamp-1">
                                                    {report.description}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPinIcon className="h-4 w-4" />
                                            <span className="line-clamp-1">{report.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                {getStatusIcon(report.status)}
                                                <span className="capitalize">{report.status.replace('_', ' ')}</span>
                                            </div>
                                            <Badge variant={getRiskBadgeVariant(report.severity)}>
                                                {report.severity === "high" && "ความเสี่ยงสูง"}
                                                {report.severity === "medium" && "ปานกลาง"}
                                                {report.severity === "low" && "ต่ำ"}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleViewDetails(report)}
                                            >
                                                ดูรายละเอียด
                                            </Button>
                                            {user && (user.role === 'admin' || user.role === 'technician') && (
                                                <>
                                                    {report.status === 'reported' && (
                                                        <Button size="sm" onClick={() => handleUpdateStatus(report.id, 'acknowledged')} className="flex-1">
                                                            รับเรื่อง
                                                        </Button>
                                                    )}
                                                    {report.status === 'acknowledged' && (
                                                        <Button size="sm" onClick={() => handleUpdateStatus(report.id, 'in_progress')} className="flex-1">
                                                            เริ่มดำเนินการ
                                                        </Button>
                                                    )}
                                                    {report.status === 'in_progress' && (
                                                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(report.id, 'cleared')} className="flex-1">
                                                            เสร็จสิ้น
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* My Reports */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">รายงานของฉัน</h2>
                        {myReports.length === 0 ? (
                            <Card className="p-8 text-center text-muted-foreground">
                                คุณยังไม่เคยแจ้งจุดขยะ
                            </Card>
                        ) : (
                            myReports.map((report) => (
                                <Card key={report.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="destructive">แจ้งจุดขยะ</Badge>
                                                    <Badge variant="outline">
                                                        {wasteTypeOptions.find(opt => opt.value === report.wasteType)?.label || report.wasteType}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg mb-1 line-clamp-1">
                                                    {report.description}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPinIcon className="h-4 w-4" />
                                            <span className="line-clamp-1">{report.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                {getStatusIcon(report.status)}
                                                <span className="capitalize">{report.status.replace('_', ' ')}</span>
                                            </div>
                                            <Badge variant={getRiskBadgeVariant(report.severity)}>
                                                {report.severity === "high" && "ความเสี่ยงสูง"}
                                                {report.severity === "medium" && "ปานกลาง"}
                                                {report.severity === "low" && "ต่ำ"}
                                            </Badge>
                                        </div>

                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleViewDetails(report)}
                                            >
                                                ดูรายละเอียด
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <UniversalDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                type="waste"
                data={selectedReport}
            />
        </div>
    );
};

export default WasteDashboard;
