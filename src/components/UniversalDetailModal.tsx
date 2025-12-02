import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    MapPinIcon,
    DollarSignIcon,
    ClockIcon,
    UserIcon,
    CalendarIcon,
    PhoneIcon,
    MailIcon,
    ShareIcon,
    BookmarkIcon,
    TargetIcon,
    MessageCircleIcon,
    UsersIcon,
    TrashIcon,
    AlertTriangle,
    TruckIcon,
    CheckCircle,
    Box,
    ArrowRight,
    Heart,
    LockIcon
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import dynamic from 'next/dynamic';
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
});

// Types
export type ItemType = 'job' | 'waste' | 'resource' | 'need';

interface UniversalDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ItemType;
    data: any; // Using any for flexibility, but should be typed properly in a real app
}

const URGENCY_COLORS = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
    critical: "bg-red-100 text-red-800",
} as const;

const POSTING_TYPE_COLORS = {
    hiring: "bg-blue-100 text-blue-800",
    seeking: "bg-purple-100 text-purple-800",
} as const;

export function UniversalDetailModal({ isOpen, onClose, type, data }: UniversalDetailModalProps) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    if (!data) return null;

    // Helper functions
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const formatWage = (wageAmount: number | null, wageType: string | null) => {
        if (!wageAmount || wageType === "negotiable") {
            return wageType === "negotiable" ? "ตกลงกันได้" : "ไม่ระบุ";
        }
        const wageText = `${wageAmount.toLocaleString()} บาท`;
        const unitMap: Record<string, string> = {
            daily: "/วัน",
            hourly: "/ชั่วโมง",
            per_project: "/ครั้ง",
            negotiable: ""
        };
        return `${wageText}${unitMap[wageType || ''] || ""}`;
    };

    const renderProtectedName = (name: string, label: string) => {
        if (isAuthenticated) {
            return (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <UserIcon className="h-4 w-4" />
                    <span>{label}: {name}</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => { onClose(); router.push('/login'); }}>
                <LockIcon className="h-3 w-3" />
                <span>เข้าสู่ระบบเพื่อดูชื่อผู้แจ้ง</span>
            </div>
        );
    };

    // Render Content based on Type
    const renderContent = () => {
        switch (type) {
            case 'job':
                return renderJobContent();
            case 'waste':
                return renderWasteContent();
            case 'resource':
            case 'need':
                return renderResourceContent();
            default:
                return <div>Unknown Type</div>;
        }
    };

    const renderJobContent = () => {
        const isGeneralJob = 'posting_type' in data;

        if (!isGeneralJob) {
            // Repair Job Content
            return (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-none">
                            <CardHeader className="p-0 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="destructive">งานซ่อม</Badge>
                                        <Badge variant="outline">{data.job_type}</Badge>
                                    </div>
                                </div>
                                <CardTitle className="text-2xl mb-2">{data.title}</CardTitle>
                                <CardDescription className="text-base leading-relaxed">
                                    {data.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {(data.location || data.coordinates) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPinIcon className="h-5 w-5" />
                                        สถานที่
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.coordinates && (
                                        <div className="mb-4 h-48 w-full rounded-lg overflow-hidden">
                                            <Map
                                                center={typeof data.coordinates === 'string' ? JSON.parse(data.coordinates) : data.coordinates}
                                                zoom={15}
                                                items={[{
                                                    id: data.id,
                                                    type: 'job',
                                                    title: data.title,
                                                    description: data.description,
                                                    status: data.status,
                                                    location: data.location,
                                                    coordinates: typeof data.coordinates === 'string' ? JSON.parse(data.coordinates) : data.coordinates
                                                }]}
                                            />
                                        </div>
                                    )}
                                    {data.location && (
                                        <p className="text-gray-700">{data.location}</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>ข้อมูลงาน</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <TargetIcon className="h-4 w-4 text-gray-500" />
                                    <Badge className={URGENCY_COLORS[data.urgency as keyof typeof URGENCY_COLORS]}>
                                        {data.urgency === "low" && "ไม่ด่วน"}
                                        {data.urgency === "medium" && "ปานกลาง"}
                                        {data.urgency === "high" && "ด่วน"}
                                        {data.urgency === "urgent" && "ด่วนมาก"}
                                        {data.urgency === "critical" && "ด่วนที่สุด"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>แจ้งเมื่อ {formatDate(data.createdAt || data.created_at)}</span>
                                </div>
                                {renderProtectedName(data.requesterName || data.requester_name || "ไม่ระบุ", "ผู้แจ้ง")}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        }

        const isHiring = data.posting_type === "hiring";
        const isExpired = data.expires_at && new Date(data.expires_at) < new Date();

        return (
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="p-0 pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge className={POSTING_TYPE_COLORS[data.posting_type as keyof typeof POSTING_TYPE_COLORS]}>
                                        {isHiring ? "หาคนทำงาน" : "หางานทำ"}
                                    </Badge>
                                    {data.category_name && (
                                        <Badge variant="outline">{data.category_name}</Badge>
                                    )}
                                    {isExpired && (
                                        <Badge variant="destructive">หมดอายุ</Badge>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <ShareIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <BookmarkIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <CardTitle className="text-2xl mb-2">{data.title}</CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                                {data.description}
                            </CardDescription>

                            {data.subcategory && (
                                <div className="flex items-center gap-2 mt-3">
                                    <TargetIcon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{data.subcategory}</span>
                                </div>
                            )}
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>รายละเอียดงาน</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.requirements && (
                                <div>
                                    <h4 className="font-medium mb-2">คุณสมบัติที่ต้องการ:</h4>
                                    <p className="text-gray-700 whitespace-pre-line">{data.requirements}</p>
                                </div>
                            )}

                            {data.skills_required && (
                                <div>
                                    <h4 className="font-medium mb-2">ทักษะที่ต้องการ:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.skills_required.split(',').map((skill: string, index: number) => (
                                            <Badge key={index} variant="secondary">
                                                {skill.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.work_duration && (
                                <div>
                                    <h4 className="font-medium mb-2">ระยะเวลาทำงาน:</h4>
                                    <p className="text-gray-700">{data.work_duration}</p>
                                </div>
                            )}

                            {data.work_location_type && (
                                <div>
                                    <h4 className="font-medium mb-2">ประเภทสถานที่ทำงาน:</h4>
                                    <Badge variant="outline">
                                        {data.work_location_type === "onsite" && "ที่สถานที่"}
                                        {data.work_location_type === "remote" && "ทำงานที่บ้าน/ออนไลน์"}
                                        {data.work_location_type === "hybrid" && "ทั้งที่สถานที่และออนไลน์"}
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {(data.location || data.coordinates) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5" />
                                    สถานที่
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.coordinates && (
                                    <div className="mb-4 h-48 w-full rounded-lg overflow-hidden">
                                        <Map
                                            center={typeof data.coordinates === 'string' ? JSON.parse(data.coordinates) : data.coordinates}
                                            zoom={15}
                                            items={[{
                                                id: data.id,
                                                type: 'job',
                                                title: data.title,
                                                description: data.description,
                                                status: data.status,
                                                location: data.location,
                                                coordinates: typeof data.coordinates === 'string' ? JSON.parse(data.coordinates) : data.coordinates
                                            }]}
                                        />
                                    </div>
                                )}
                                {data.location && (
                                    <p className="text-gray-700">{data.location}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5" />
                                {isHiring ? "ผู้ประกาศงาน" : "ผู้หางาน"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`/api/users/${isHiring ? data.employer_id : data.seeker_id}/avatar`} />
                                        <AvatarFallback>
                                            {(isHiring ? data.employer_name : data.seeker_name)?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {isHiring ? data.employer_name : data.seeker_name || "ไม่ระบุชื่อ"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {isHiring ? "ผู้ประกาศงาน" : "ผู้หางาน"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <LockIcon className="h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm text-muted-foreground mb-2">เข้าสู่ระบบเพื่อดูข้อมูลผู้ประกาศ</p>
                                    <Button variant="outline" size="sm" onClick={() => { onClose(); router.push('/login'); }}>
                                        เข้าสู่ระบบ
                                    </Button>
                                </div>
                            )}

                            {isAuthenticated && (
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    แสดงข้อมูลติดต่อ
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>ข้อมูลงาน</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(data.wage_amount || data.wage_type === "negotiable") && (
                                <div className="flex items-center gap-2">
                                    <DollarSignIcon className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">
                                        {formatWage(data.wage_amount, data.wage_type)}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <TargetIcon className="h-4 w-4 text-gray-500" />
                                <Badge className={URGENCY_COLORS[data.urgency as keyof typeof URGENCY_COLORS]}>
                                    {data.urgency === "low" && "ไม่ด่วน"}
                                    {data.urgency === "medium" && "ปานกลาง"}
                                    {data.urgency === "high" && "ด่วน"}
                                    {data.urgency === "urgent" && "ด่วนมาก"}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4" />
                                <span>โพสต์เมื่อ {formatDate(data.created_at)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {!isHiring && !isExpired && isAuthenticated && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            สมัครงานนี้
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    const renderWasteContent = () => {
        const getStatusIcon = (status: string) => {
            switch (status) {
                case "reported": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
                case "acknowledged": return <MapPinIcon className="h-5 w-5 text-blue-500" />;
                case "in_progress": return <TruckIcon className="h-5 w-5 text-orange-500" />;
                case "cleared": return <CheckCircle className="h-5 w-5 text-green-500" />;
                default: return <TrashIcon className="h-5 w-5 text-gray-500" />;
            }
        };

        return (
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="p-0 pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="destructive">แจ้งจุดขยะ</Badge>
                                    <Badge variant="outline">{data.wasteType}</Badge>
                                </div>
                            </div>
                            <CardTitle className="text-2xl mb-2">รายงานจุดขยะ: {data.wasteType}</CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                                {data.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {(data.location || data.coordinates) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5" />
                                    สถานที่
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.coordinates && (
                                    <div className="mb-4 h-48 w-full rounded-lg overflow-hidden">
                                        <Map
                                            center={data.coordinates}
                                            zoom={15}
                                            items={[{
                                                id: data.id,
                                                type: 'waste',
                                                title: `ขยะ: ${data.wasteType}`,
                                                description: data.description,
                                                status: data.status,
                                                location: data.location,
                                                coordinates: data.coordinates
                                            }]}
                                        />
                                    </div>
                                )}
                                {data.location && (
                                    <p className="text-gray-700">{data.location}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>สถานะ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                {getStatusIcon(data.status)}
                                <span className="font-medium capitalize">{data.status.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TargetIcon className="h-4 w-4 text-gray-500" />
                                <Badge className={URGENCY_COLORS[data.severity as keyof typeof URGENCY_COLORS] || "bg-gray-100"}>
                                    {data.severity === "high" && "ความเสี่ยงสูง"}
                                    {data.severity === "medium" && "ปานกลาง"}
                                    {data.severity === "low" && "ต่ำ"}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4" />
                                <span>แจ้งเมื่อ {formatDate(data.createdAt)}</span>
                            </div>
                            {renderProtectedName(data.reporterName, "ผู้แจ้ง")}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };

    const renderResourceContent = () => {
        const isNeed = type === 'need';
        return (
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-none">
                        <CardHeader className="p-0 pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge className={isNeed ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                                        {isNeed ? "ขอความช่วยเหลือ" : "บริจาคทรัพยากร"}
                                    </Badge>
                                    <Badge variant="outline">{data.resourceType || data.type}</Badge>
                                </div>
                            </div>
                            <CardTitle className="text-2xl mb-2">{isNeed ? `ต้องการ: ${data.resourceType}` : `บริจาค: ${data.name}`}</CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                                {data.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>รายละเอียด</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-gray-500">จำนวน</h4>
                                    <p>{isNeed ? data.requiredQuantity : data.quantity} {data.unit}</p>
                                </div>
                                {isNeed && (
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-500">ผู้ได้รับประโยชน์</h4>
                                        <p>{data.beneficiaryCount} คน</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {(data.location || data.coordinates) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5" />
                                    สถานที่
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.coordinates && (
                                    <div className="mb-4 h-48 w-full rounded-lg overflow-hidden">
                                        <Map
                                            center={data.coordinates}
                                            zoom={15}
                                            items={[{
                                                id: data.id,
                                                type: isNeed ? 'need' : 'resource',
                                                title: isNeed ? `ต้องการ: ${data.resourceType}` : data.name,
                                                description: data.description,
                                                status: data.status,
                                                location: data.location,
                                                coordinates: data.coordinates
                                            }]}
                                        />
                                    </div>
                                )}
                                {data.location && (
                                    <p className="text-gray-700">{data.location}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>ข้อมูลเพิ่มเติม</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <TargetIcon className="h-4 w-4 text-gray-500" />
                                <Badge className={URGENCY_COLORS[(data.urgency || data.priority) as keyof typeof URGENCY_COLORS] || "bg-gray-100"}>
                                    {(data.urgency || data.priority) === "critical" && "ด่วนที่สุด"}
                                    {(data.urgency || data.priority) === "high" && "สูง"}
                                    {(data.urgency || data.priority) === "medium" && "ปานกลาง"}
                                    {(data.urgency || data.priority) === "low" && "ต่ำ"}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4" />
                                <span>เมื่อ {formatDate(data.createdAt)}</span>
                            </div>
                            {renderProtectedName(isNeed ? data.requesterName : data.donorName, isNeed ? "ผู้ขอ" : "ผู้บริจาค")}
                        </CardContent>
                    </Card>

                    {isAuthenticated && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            {isNeed ? "ให้ความช่วยเหลือ" : "ขอรับบริจาค"}
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
                <DialogTitle className="sr-only">รายละเอียด</DialogTitle>
                <div className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <Button variant="outline" onClick={onClose}>ปิด</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
