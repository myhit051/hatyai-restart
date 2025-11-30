"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MessageCircleIcon,
  UsersIcon,
  TargetIcon,
  WrenchIcon
} from "lucide-react";
import {
  getGeneralJobById,
  createJobApplication,
  showJobContact,
  getJobApplications,
  incrementJobViewCount,
  GeneralJob,
  JobApplication,
  PostingType
} from "@/app/actions/general-jobs";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Map } from "@/components/Map";

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

const APPLICATION_STATUS_COLORS = {
  applied: "bg-gray-100 text-gray-800",
  viewed: "bg-blue-100 text-blue-800",
  contacted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-emerald-100 text-emerald-800",
} as const;

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<GeneralJob | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  useEffect(() => {
    if (jobId) {
      loadJobDetail();
    }
  }, [jobId]);

  const loadJobDetail = async () => {
    try {
      setLoading(true);

      // Increment view count
      await incrementJobViewCount(jobId);

      const [jobData, applicationsData] = await Promise.all([
        getGeneralJobById(jobId),
        getJobApplications(jobId),
      ]);

      setJob(jobData);
      setApplications(applicationsData);

      // Check if user has already viewed contact info
      if (jobData) {
        const response = await fetch(`/api/jobs/${jobId}/contact-status`);
        if (response.ok) {
          const data = await response.json();
          setShowContactInfo(data.hasViewed);
        }
      }
    } catch (error) {
      console.error("Error loading job detail:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลงานได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowContact = async () => {
    try {
      // In a real app, we'd get current user ID
      const userId = "current_user_id"; // This would come from auth

      const result = await showJobContact(jobId, userId);

      if (result.success) {
        setShowContactInfo(true);
        toast({
          title: "แสดงข้อมูลติดต่อ",
          description: "ข้อมูลติดต่อได้ถูกเปิดเผยแล้ว",
        });
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: result.error || "ไม่สามารถแสดงข้อมูลติดต่อได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error showing contact:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแสดงข้อมูลติดต่อได้",
        variant: "destructive",
      });
    }
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);

      // In a real app, we'd get current user ID
      const userId = "current_user_id"; // This would come from auth

      const result = await createJobApplication(
        jobId,
        userId,
        applicationMessage.trim() || undefined
      );

      if (result.success) {
        toast({
          title: "สมัครงานสำเร็จ!",
          description: "ข้อมูลการสมัครได้ถูกส่งให้ผู้ประกาศงานแล้ว",
        });

        // Reload applications to show the new one
        const updatedApplications = await getJobApplications(jobId);
        setApplications(updatedApplications);
        setApplicationMessage("");
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: result.error || "ไม่สามารถสมัครงานได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสมัครงานได้",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const formatWage = (wageAmount: number | null, wageType: string | null) => {
    if (!wageAmount || wageType === "negotiable") {
      return wageType === "negotiable" ? "ตกลงกันได้" : "ไม่ระบุ";
    }

    const wageText = `${wageAmount.toLocaleString()} THB`;
    const unitMap = {
      daily: "/วัน",
      hourly: "/ชั่วโมง",
      per_project: "/ครั้ง",
      negotiable: ""
    };

    return `${wageText}${unitMap[wageType as keyof typeof unitMap] || ""}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = job?.expires_at && new Date(job.expires_at) < new Date();
  const isHiring = job?.posting_type === "hiring";

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบงาน</h1>
          <p className="text-gray-600 mb-4">ไม่พบข้อมูลงานที่คุณค้นหา</p>
          <Button onClick={() => router.push("/jobs")}>
            กลับไปหน้ารายการงาน
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={POSTING_TYPE_COLORS[job.posting_type]}>
                    {isHiring ? "หาคนทำงาน" : "หางานทำ"}
                  </Badge>
                  {job.category_name && (
                    <Badge variant="outline">{job.category_name}</Badge>
                  )}
                  {isExpired && (
                    <Badge variant="destructive">หมดอายุ</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookmarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {job.description}
              </CardDescription>

              {job.subcategory && (
                <div className="flex items-center gap-2 mt-3">
                  <TargetIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{job.subcategory}</span>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดงาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.requirements && (
                <div>
                  <h4 className="font-medium mb-2">คุณสมบัติที่ต้องการ:</h4>
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </div>
              )}

              {job.skills_required && (
                <div>
                  <h4 className="font-medium mb-2">ทักษะที่ต้องการ:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.split(',').map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {job.work_duration && (
                <div>
                  <h4 className="font-medium mb-2">ระยะเวลาทำงาน:</h4>
                  <p className="text-gray-700">{job.work_duration}</p>
                </div>
              )}

              {job.work_location_type && (
                <div>
                  <h4 className="font-medium mb-2">ประเภทสถานที่ทำงาน:</h4>
                  <Badge variant="outline">
                    {job.work_location_type === "onsite" && "ที่สถานที่"}
                    {job.work_location_type === "remote" && "ทำงานที่บ้าน/ออนไลน์"}
                    {job.work_location_type === "hybrid" && "ทั้งที่สถานที่และออนไลน์"}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {(job.location || job.coordinates) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  สถานที่
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.coordinates && (
                  <div className="mb-4">
                    <Map
                      center={JSON.parse(job.coordinates)}
                      zoom={15}
                      markers={job.coordinates ? [JSON.parse(job.coordinates)] : []}
                      className="h-64 w-full rounded-lg"
                    />
                  </div>
                )}
                {job.location && (
                  <p className="text-gray-700">{job.location}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Applications (if job is hiring) */}
          {isHiring && applications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  ผู้สมัคร ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/api/users/${application.applicant_id}/avatar`} />
                            <AvatarFallback>
                              {application.applicant_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{application.applicant_name || "ไม่ระบุชื่อ"}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(application.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge className={APPLICATION_STATUS_COLORS[application.status]}>
                          {application.status === "applied" && "รับสมัครแล้ว"}
                          {application.status === "viewed" && "ดูแล้ว"}
                          {application.status === "contacted" && "ติดต่อแล้ว"}
                          {application.status === "rejected" && "ปฏิเสธ"}
                          {application.status === "accepted" && "รับเข้าทำงาน"}
                        </Badge>
                      </div>
                      {application.message && (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                          {application.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                {isHiring ? "ผู้ประกาศงาน" : "ผู้หางาน"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/api/users/${isHiring ? job.employer_id : job.seeker_id}/avatar`} />
                  <AvatarFallback>
                    {(isHiring ? job.employer_name : job.seeker_name)?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {isHiring ? job.employer_name : job.seeker_name || "ไม่ระบุชื่อ"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isHiring ? "ผู้ประกาศงาน" : "ผู้หางาน"}
                  </p>
                </div>
              </div>

              {showContactInfo && (
                <div className="space-y-3 pt-3 border-t">
                  {job.contact_person && (
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <span>{job.contact_person}</span>
                    </div>
                  )}
                  {job.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-500" />
                      <a
                        href={`tel:${job.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {job.contact_phone}
                      </a>
                    </div>
                  )}
                  {job.contact_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <MailIcon className="h-4 w-4 text-gray-500" />
                      <a
                        href={`mailto:${job.contact_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {job.contact_email}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {!showContactInfo && !isExpired && (
                <Button
                  onClick={handleShowContact}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  แสดงข้อมูลติดต่อ
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Job Info */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลงาน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(job.wage_amount || job.wage_type === "negotiable") && (
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {formatWage(job.wage_amount, job.wage_type)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <TargetIcon className="h-4 w-4 text-gray-500" />
                <Badge className={URGENCY_COLORS[job.urgency]}>
                  {job.urgency === "low" && "ไม่ด่วน"}
                  {job.urgency === "medium" && "ปานกลาง"}
                  {job.urgency === "high" && "ด่วน"}
                  {job.urgency === "urgent" && "ด่วนมาก"}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4" />
                <span>โพสต์เมื่อ {formatDate(job.created_at)}</span>
              </div>

              {job.expires_at && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span className={isExpired ? "text-red-600 font-medium" : ""}>
                    {isExpired ? "หมดอายุ" : "หมดอายุ"}: {formatDate(job.expires_at)}
                  </span>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-lg">{job.view_count || 0}</div>
                  <div className="text-gray-500">ยอดวิว</div>
                </div>
                <div>
                  <div className="font-bold text-lg">{job.contact_count || 0}</div>
                  <div className="text-gray-500">ติดต่อ</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apply Form (for seeking jobs) */}
          {!isHiring && !isExpired && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleIcon className="h-5 w-5" />
                  สมัครงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="message">ข้อความถึงผู้ประกาศงาน (ไม่จำเป็น)</Label>
                  <Textarea
                    id="message"
                    placeholder="บอกเกี่ยวกับตัวคุณและทักษะที่เกี่ยวข้อง..."
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isApplying ? "กำลังสมัคร..." : "สมัครงานนี้"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Share */}
          <Card>
            <CardHeader>
              <CardTitle>แชร์งานนี้</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ShareIcon className="h-4 w-4 mr-2" />
                แชร์ลิงก์
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookmarkIcon className="h-4 w-4 mr-2" />
                บันทึกงาน
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}