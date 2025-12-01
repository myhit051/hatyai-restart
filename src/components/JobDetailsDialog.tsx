import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MapPinIcon,
    DollarSignIcon,
    ClockIcon,
    UserIcon,
    CalendarIcon,
    PhoneIcon,
    MailIcon,
} from "lucide-react";
import { GeneralJob } from "@/app/actions/general-jobs";
import { Job } from "@/app/actions/jobs";

interface JobDetailsDialogProps {
    job: GeneralJob | Job | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function JobDetailsDialog({ job, open, onOpenChange }: JobDetailsDialogProps) {
    if (!job) return null;

    const isGeneralJob = (j: GeneralJob | Job): j is GeneralJob => {
        return 'posting_type' in j;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'urgent':
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUrgencyLabel = (urgency: string) => {
        switch (urgency) {
            case 'low': return 'ไม่ด่วน';
            case 'medium': return 'ปานกลาง';
            case 'high': return 'ด่วน';
            case 'urgent':
            case 'critical': return 'ด่วนมาก';
            default: return urgency;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-start justify-between gap-4">
                        <div className="w-full">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {isGeneralJob(job) ? (
                                    <>
                                        <Badge className={job.posting_type === 'hiring' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                                            {job.posting_type === 'hiring' ? 'หาคนทำ' : 'หางานทำ'}
                                        </Badge>
                                        {job.category_name && <Badge variant="outline">{job.category_name}</Badge>}
                                    </>
                                ) : (
                                    <Badge variant="destructive">งานซ่อม</Badge>
                                )}
                                <Badge className={getUrgencyColor(job.urgency)} variant="secondary">
                                    {getUrgencyLabel(job.urgency)}
                                </Badge>
                            </div>
                            <DialogTitle className="text-xl sm:text-2xl leading-tight">{job.title}</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6">
                    <div className="space-y-6 pb-6 pt-2">
                        {/* Description */}
                        <div>
                            <h3 className="font-semibold mb-2 text-gray-900">รายละเอียดงาน</h3>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{job.description || "ไม่มีรายละเอียด"}</p>
                        </div>

                        <Separator />

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                            <div className="space-y-1">
                                <span className="text-sm text-gray-500 flex items-center gap-2">
                                    <UserIcon className="h-4 w-4" />
                                    ผู้โพสต์
                                </span>
                                <p className="font-medium">
                                    {isGeneralJob(job)
                                        ? (job.employer_name || job.seeker_name || "ไม่ระบุชื่อ")
                                        : (job.requester_name || "ไม่ระบุชื่อ")
                                    }
                                </p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-sm text-gray-500 flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    วันที่ลงประกาศ
                                </span>
                                <p className="font-medium">{formatDate(job.created_at)}</p>
                            </div>

                            {job.location && (
                                <div className="space-y-1 sm:col-span-2">
                                    <span className="text-sm text-gray-500 flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4" />
                                        สถานที่
                                    </span>
                                    <p className="font-medium">{job.location}</p>
                                </div>
                            )}

                            {isGeneralJob(job) && (
                                <>
                                    {(job.wage_amount || job.wage_type === 'negotiable') && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                                <DollarSignIcon className="h-4 w-4" />
                                                ค่าตอบแทน
                                            </span>
                                            <p className="font-medium">
                                                {job.wage_type === 'negotiable'
                                                    ? 'ตกลงกันได้'
                                                    : `${job.wage_amount?.toLocaleString()} บาท/${job.wage_type === 'daily' ? 'วัน' :
                                                        job.wage_type === 'hourly' ? 'ชั่วโมง' :
                                                            job.wage_type === 'per_project' ? 'งาน' : ''
                                                    }`
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {job.work_duration && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                                <ClockIcon className="h-4 w-4" />
                                                ระยะเวลาทำงาน
                                            </span>
                                            <p className="font-medium">{job.work_duration}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Contact Info (Only for General Jobs for now as per existing UI) */}
                        {isGeneralJob(job) && (job.contact_person || job.contact_phone || job.contact_email) && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-3 text-gray-900">ข้อมูลติดต่อ</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {job.contact_person && (
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4 text-gray-500" />
                                                <span>{job.contact_person}</span>
                                            </div>
                                        )}
                                        {job.contact_phone && (
                                            <div className="flex items-center gap-2">
                                                <PhoneIcon className="h-4 w-4 text-gray-500" />
                                                <a href={`tel:${job.contact_phone}`} className="text-blue-600 hover:underline font-medium">
                                                    {job.contact_phone}
                                                </a>
                                            </div>
                                        )}
                                        {job.contact_email && (
                                            <div className="flex items-center gap-2">
                                                <MailIcon className="h-4 w-4 text-gray-500" />
                                                <a href={`mailto:${job.contact_email}`} className="text-blue-600 hover:underline font-medium">
                                                    {job.contact_email}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-4 border-t mt-auto">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        ปิด
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
