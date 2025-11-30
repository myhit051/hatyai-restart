"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useResourceStore } from "@/store/resourceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResourceType, ResourceStatus, ResourceNeed } from "@/store/resourceStore";
import { HeartIcon, PlusIcon, CubeIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import ImageUpload from "@/components/ui/image-upload";
import LocationPicker from "@/components/LocationPicker";
import ClientOnly from "@/components/ClientOnly";

const ResourceDashboard = () => {
    const { user } = useAuthStore();
    const { resources, needs, donateResource, requestNeed, matchResource, findMatches, loadData, myDonations, myNeeds, availableResources, pendingNeeds, updateResourceStatus, updateNeedStatus } = useResourceStore();
    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [newDonation, setNewDonation] = useState({
        type: "other" as ResourceType,
        name: "",
        description: "",
        quantity: "",
        unit: "ชิ้น",
        location: "",
        priority: "medium" as "low" | "medium" | "high" | "critical",
        qualityCondition: "good" as "excellent" | "good" | "fair" | "poor",
        images: [] as string[],
        coordinates: null as { lat: number; lng: number } | null,
    });
    const [newNeed, setNewNeed] = useState({
        resourceType: "other" as ResourceType,
        requiredQuantity: "",
        unit: "ชิ้น",
        location: "",
        description: "",
        urgency: "medium" as "low" | "medium" | "high" | "critical",
        specialRequirements: "",
        beneficiaryCount: 10,
        vulnerabilityLevel: "medium" as "low" | "medium" | "high",
        coordinates: null as { lat: number; lng: number } | null,
    });

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDonateResource = async () => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนบริจาค");
            return;
        }
        try {
            const result = await donateResource({
                ...newDonation,
                quantity: parseInt(newDonation.quantity) || 0,
                donorId: user.id,
                donorName: user.name,
                coordinates: newDonation.coordinates || undefined,
            });

            if (result && result.success) {
                setNewDonation({
                    type: "other",
                    name: "",
                    description: "",
                    quantity: "",
                    unit: "ชิ้น",
                    location: "",
                    priority: "medium",
                    qualityCondition: "good",
                    images: [],
                    coordinates: null,
                });
                setIsDonateDialogOpen(false);
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (result?.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error donating resource:", error);
            alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
        }
    };

    const handleRequestNeed = async () => {
        if (!user) {
            alert("กรุณาเข้าสู่ระบบก่อนขอความช่วยเหลือ");
            return;
        }
        try {
            const result = await requestNeed({
                ...newNeed,
                requiredQuantity: parseInt(newNeed.requiredQuantity) || 0,
                requesterId: user.id,
                requesterName: user.name,
                coordinates: newNeed.coordinates || undefined,
            });

            if (result && result.success) {
                setNewNeed({
                    resourceType: "other",
                    requiredQuantity: "",
                    unit: "ชิ้น",
                    location: "",
                    description: "",
                    urgency: "medium",
                    specialRequirements: "",
                    beneficiaryCount: 10,
                    vulnerabilityLevel: "medium",
                    coordinates: null,
                });
                setIsRequestDialogOpen(false);
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (result?.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error requesting need:", error);
            alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
        }
    };

    const handleMatchResource = async (resourceId: string, needId: string) => {
        await matchResource(resourceId, needId);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "available":
                return <CubeIcon className="h-4 w-4 text-green-500" />;
            case "assigned":
                return <ArrowRightIcon className="h-4 w-4 text-blue-500" />;
            case "distributed":
                return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
            default:
                return <CubeIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority) {
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

    const resourceTypeOptions = [
        { value: "food", label: "อาหารและน้ำดื่ม" },
        { value: "water", label: "น้ำดื่ม" },
        { value: "medicine", label: "ยาและเวชภัณฑ์" },
        { value: "shelter", label: "ที่พักพักพิง" },
        { value: "clothing", label: "เสื้อผ้าและผ้าห่ม" },
        { value: "tools", label: "อุปกรณ์และเครื่องมือ" },
        { value: "construction", label: "วัสดุก่อสร้าง" },
        { value: "other", label: "อื่นๆ" }
    ];

    return (
        <ClientOnly>
            <div className="min-h-screen bg-background">

                <div className="max-w-6xl mx-auto p-4 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">ศูนย์บริจาคและทรัพยากร</h1>
                            <p className="text-muted-foreground">บริจาคและกระจายทรัพยากรช่วยเหลือผู้ประสบภัย</p>
                        </div>

                        <div className="flex gap-2">
                            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <UsersIcon className="h-4 w-4 mr-2" />
                                        ขอรับความช่วยเหลือ
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>ขอรับความช่วยเหลือ</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="needType">ประเภททรัพยากรที่ต้องการ</Label>
                                            <Select
                                                value={newNeed.resourceType}
                                                onValueChange={(value: ResourceType) => setNewNeed(prev => ({ ...prev, resourceType: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {resourceTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="requiredQuantity">จำนวนที่ต้องการ</Label>
                                                <Input
                                                    id="requiredQuantity"
                                                    value={newNeed.requiredQuantity}
                                                    onChange={(e) => setNewNeed(prev => ({ ...prev, requiredQuantity: e.target.value }))}
                                                    placeholder="จำนวน"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="unit">หน่วย</Label>
                                                <Input
                                                    id="unit"
                                                    value={newNeed.unit}
                                                    onChange={(e) => setNewNeed(prev => ({ ...prev, unit: e.target.value }))}
                                                    placeholder="ชิ้น, กล่อง, ขวด"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="needLocation">สถานที่จัดส่ง</Label>
                                            <LocationPicker
                                                value={newNeed.coordinates}
                                                onChange={(coords) => setNewNeed(prev => ({ ...prev, coordinates: coords }))}
                                                addressValue={newNeed.location}
                                                onAddressChange={(val) => setNewNeed(prev => ({ ...prev, location: val }))}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="needDescription">รายละเอียดความต้องการ</Label>
                                            <Textarea
                                                id="needDescription"
                                                value={newNeed.description}
                                                onChange={(e) => setNewNeed(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="อธิบายความต้องการและสถานการณ์..."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="urgency">ความเร่งด่วน</Label>
                                                <Select
                                                    value={newNeed.urgency}
                                                    onValueChange={(value: "low" | "medium" | "high" | "critical") => setNewNeed(prev => ({ ...prev, urgency: value }))}
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

                                            <div>
                                                <Label htmlFor="beneficiaryCount">จำนวนผู้ได้รับประโยชน์</Label>
                                                <Input
                                                    id="beneficiaryCount"
                                                    type="number"
                                                    value={newNeed.beneficiaryCount}
                                                    onChange={(e) => setNewNeed(prev => ({ ...prev, beneficiaryCount: parseInt(e.target.value) || 0 }))}
                                                />
                                            </div>
                                        </div>

                                        <Button onClick={handleRequestNeed} className="w-full">
                                            ขอรับความช่วยเหลือ
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <HeartIcon className="h-4 w-4 mr-2" />
                                        บริจาคทรัพยากร
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>บริจาคทรัพยากร</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="resourceType">ประเภททรัพยากร</Label>
                                            <Select
                                                value={newDonation.type}
                                                onValueChange={(value: ResourceType) => setNewDonation(prev => ({ ...prev, type: value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {resourceTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="resourceName">ชื่อทรัพยากร</Label>
                                            <Input
                                                id="resourceName"
                                                value={newDonation.name}
                                                onChange={(e) => setNewDonation(prev => ({ ...prev, name: e.target.value }))}
                                                placeholder="เช่น น้ำดื่มขวดใหญ่, ข้าวสาร 5 กก."
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="resourceDescription">รายละเอียด</Label>
                                            <Textarea
                                                id="resourceDescription"
                                                value={newDonation.description}
                                                onChange={(e) => setNewDonation(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="อธิบายรายละเอียดและสภาพของทรัพยากร..."
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="quantity">จำนวน</Label>
                                                <Input
                                                    id="quantity"
                                                    value={newDonation.quantity}
                                                    onChange={(e) => setNewDonation(prev => ({ ...prev, quantity: e.target.value }))}
                                                    placeholder="จำนวน"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="unit">หน่วย</Label>
                                                <Input
                                                    id="unit"
                                                    value={newDonation.unit}
                                                    onChange={(e) => setNewDonation(prev => ({ ...prev, unit: e.target.value }))}
                                                    placeholder="ชิ้น, กล่อง, ขวด"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="donationLocation">สถานที่รับบริจาค</Label>
                                            <LocationPicker
                                                value={newDonation.coordinates}
                                                onChange={(coords) => setNewDonation(prev => ({ ...prev, coordinates: coords }))}
                                                addressValue={newDonation.location}
                                                onAddressChange={(val) => setNewDonation(prev => ({ ...prev, location: val }))}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="priority">ความเร่งด่วน</Label>
                                                <Select
                                                    value={newDonation.priority}
                                                    onValueChange={(value: "low" | "medium" | "high" | "critical") => setNewDonation(prev => ({ ...prev, priority: value }))}
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

                                            <div>
                                                <Label htmlFor="quality">สภาพ</Label>
                                                <Select
                                                    value={newDonation.qualityCondition}
                                                    onValueChange={(value: "excellent" | "good" | "fair" | "poor") => setNewDonation(prev => ({ ...prev, qualityCondition: value }))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="excellent">ดีเยี่ยม</SelectItem>
                                                        <SelectItem value="good">ดี</SelectItem>
                                                        <SelectItem value="fair">ปานกลาง</SelectItem>
                                                        <SelectItem value="poor">พอใช้</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="mb-2 block">รูปภาพประกอบ</Label>
                                            <ImageUpload
                                                value={newDonation.images || []}
                                                onChange={(urls) => setNewDonation(prev => ({ ...prev, images: urls }))}
                                                onRemove={(url) => setNewDonation(prev => ({ ...prev, images: (prev.images || []).filter(current => current !== url) }))}
                                            />
                                        </div>

                                        <Button onClick={handleDonateResource} className="w-full">
                                            บริจาคทรัพยากร
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">ทรัพยากรทั้งหมด</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{resources.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">ทรัพยากรว่าง</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {availableResources.length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">คำขอที่รอดำเนินการ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {pendingNeeds.length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">คำขอด่วน</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {needs.filter(need => need.urgency === "critical" || need.urgency === "high").length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resource Listings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Available Resources */}
                        <Card>
                            <CardHeader>
                                <CardTitle>ทรัพยากรที่สามารถบริจาคได้</CardTitle>
                                <CardDescription>ทรัพยากรที่พร้อมสำหรับการกระจาย</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {availableResources.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        ไม่มีทรัพยากรที่ว่างในขณะนี้
                                    </p>
                                ) : (
                                    availableResources.map((resource) => {
                                        const matchedNeeds = needs.filter(
                                            need => need.resourceType === resource.type && need.status === "pending"
                                        );

                                        return (
                                            <div key={resource.id} className="border rounded-lg p-4 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{resource.name}</h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {resource.description}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {getStatusIcon(resource.status)}
                                                            <Badge variant={getPriorityBadgeVariant(resource.priority)}>
                                                                {resource.priority === "critical" && "ด่วนที่สุด"}
                                                                {resource.priority === "high" && "สูง"}
                                                                {resource.priority === "medium" && "ปานกลาง"}
                                                                {resource.priority === "low" && "ต่ำ"}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        {matchedNeeds.length > 0 && user?.role === 'admin' && (
                                                            <Select onValueChange={(needId) => handleMatchResource(resource.id, needId)}>
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue placeholder="จับคู่" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {matchedNeeds.map((need) => (
                                                                        <SelectItem key={need.id} value={need.id}>
                                                                            {need.requesterName}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}

                                                        {user && user.id !== resource.donorId && resource.status === 'available' && (
                                                            <Button size="sm" onClick={() => updateResourceStatus(resource.id, 'assigned')}>
                                                                ขอรับบริจาค
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    📍 {resource.location} • 👤 {resource.donorName}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    📦 {resource.quantity} {resource.unit}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        {/* Pending Needs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>คำขอความช่วยเหลือที่รอดำเนินการ</CardTitle>
                                <CardDescription>คำขอที่ต้องการการจับคู่ทรัพยากร</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pendingNeeds.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        ไม่มีคำขอที่รอดำเนินการในขณะนี้
                                    </p>
                                ) : (
                                    pendingNeeds.map((need) => {
                                        const matchingResources = findMatches(need.id);

                                        return (
                                            <div key={need.id} className="border rounded-lg p-4 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">
                                                            {resourceTypeOptions.find(opt => opt.value === need.resourceType)?.label}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {need.description}
                                                        </p>
                                                        <Badge variant={getPriorityBadgeVariant(need.urgency)} className="mt-2">
                                                            {need.urgency === "critical" && "ด่วนที่สุด"}
                                                            {need.urgency === "high" && "สูง"}
                                                            {need.urgency === "medium" && "ปานกลาง"}
                                                            {need.urgency === "low" && "ต่ำ"}
                                                        </Badge>
                                                    </div>

                                                    {user && user.id === need.requesterId && need.status === 'pending' && (
                                                        <Button size="sm" variant="outline" onClick={() => updateNeedStatus(need.id, 'fulfilled')}>
                                                            ได้รับแล้ว
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    📍 {need.location} • 👤 {need.requesterName}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    📦 ต้องการ: {need.requiredQuantity} {need.unit}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    👥 ผู้ได้รับประโยชน์: {need.beneficiaryCount} คน
                                                </div>

                                                {matchingResources.length > 0 && (
                                                    <div className="text-xs text-green-600">
                                                        ✅ มีทรัพยากรที่เหมาะสม {matchingResources.length} รายการ
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
};

export default ResourceDashboard;
