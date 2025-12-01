
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LocationPicker from "@/components/LocationPicker";
import ImageUpload from "@/components/ui/image-upload";
import { toast } from "@/hooks/use-toast";
import { getJobCategories, createGeneralJob, JobData, PostingType } from "@/app/actions/general-jobs";
import { JobCategory } from "@/app/actions/general-jobs";
import { CalendarIcon, MapPinIcon, DollarSignIcon, UserIcon } from "lucide-react";
import { Suspense } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const POSTING_TYPES = [
  { value: "hiring", label: "หาคนทำงาน", description: "มีงานและต้องการคนมาทำ" },
  { value: "seeking", label: "หางานทำ", description: "สามารถทำงานได้และต้องการหางาน" },
] as const;

const WAGE_TYPES = [
  { value: "daily", label: "รายวัน", unit: "บาท/วัน" },
  { value: "hourly", label: "รายชั่วโมง", unit: "บาท/ชั่วโมง" },
  { value: "per_project", label: "รายครั้ง/รายโปรเจค", unit: "บาท/ครั้ง" },
  { value: "negotiable", label: "ตกลงกันได้", unit: "" },
] as const;

const WORK_LOCATION_TYPES = [
  { value: "onsite", label: "ที่สถานที่" },
  { value: "remote", label: "ทำงานที่บ้าน/ออนไลน์" },
  { value: "hybrid", label: "ทั้งที่สถานที่และออนไลน์" },
] as const;

const URGENCY_LEVELS = [
  { value: "low", label: "ไม่ด่วน", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "ปานกลาง", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "ด่วน", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "ด่วนมาก", color: "bg-red-100 text-red-800" },
] as const;

function CreateJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [postingType, setPostingType] = useState<PostingType>("hiring");
  const [wageType, setWageType] = useState<string>("daily");
  const [workLocationType, setWorkLocationType] = useState<string>("onsite");
  const [urgency, setUrgency] = useState<string>("medium");
  const [formData, setFormData] = useState<JobData>({
    title: "",
    description: "",
    job_type: "general",
    posting_type: "hiring",
    work_location_type: "onsite",
    wage_type: "daily",
    wage_currency: "THB",
    urgency: "medium",
    images: [],
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  // Common skills that users can select
  const commonSkills = [
    "ขับรถ", "สอนพิเศษ", "ดูแลผู้สูงอายุ", "ทำความสะอาด", "ประกอบอาหาร",
    "ซ่อมบำรุง", "รักษาความปลอดภัย", "ทำสวน", "ดูแลเด็ก", "ทำงานบ้าน",
    "เขียนโปรแกรม", "ออกแบบกราฟิก", "ตัดต่อวิดีโอ", "ถ่ายรูป", "แปลภาษา",
    "ทำการบ้าน", "ติดตั้ง", "ขนย้ายของ", "จัดงาน", "บริการลูกค้า"
  ];

  useEffect(() => {
    loadCategories();

    // Set posting type from URL parameter if available
    const type = searchParams?.get('type');
    if (type === 'seeking' || type === 'hiring') {
      setPostingType(type as PostingType);
      setFormData(prev => ({ ...prev, posting_type: type as PostingType }));
    }
  }, [searchParams]);

  const loadCategories = async () => {
    const result = await getJobCategories();
    setCategories(result);

    // Also initialize categories if empty
    if (result.length === 0) {
      try {
        const { initializeJobCategories } = await import("@/app/actions/general-jobs");
        await initializeJobCategories();
        const updatedCategories = await getJobCategories();
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error initializing categories:", error);
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ต้องระบุชื่อเรื่องและรายละเอียดอย่างน้อย",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        category_id: selectedCategory || undefined,
        coordinates: location ? { lat: location.lat, lng: location.lng } : undefined,
        location: location?.address,
        skills_required: selectedSkills.length > 0 ? selectedSkills : undefined,
      };

      const result = await createGeneralJob(submitData);

      if (result.success) {
        toast({
          title: "โพสต์งานสำเร็จ!",
          description: "งานของคุณได้รับการโพสต์แล้ว",
        });
        router.push("/jobs");
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: result.error || "ไม่สามารถโพสต์งานได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโพสต์งานได้ กรุณาลองใหม่",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPostingType = POSTING_TYPES.find(type => type.value === postingType);
  const currentUrgency = URGENCY_LEVELS.find(level => level.value === urgency);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">โพสต์หางานทั่วไป</h1>
        <p className="text-gray-600">เชื่อมต่อผู้ที่ต้องการจ้างงานและผู้ที่ต้องการหางานในพื้นที่หาดใหญ่</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            ประเภทการโพสต์
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={postingType}
            onValueChange={(value) => {
              const newType = value as PostingType;
              setPostingType(newType);
              handleInputChange("posting_type", newType);
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {POSTING_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value={type.value} id={type.value} />
                <div className="flex-1">
                  <Label htmlFor={type.value} className="font-medium cursor-pointer">
                    {type.label}
                  </Label>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Accordion type="single" collapsible defaultValue="main-info" className="w-full space-y-4">
          <AccordionItem value="main-info" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>1. ข้อมูลหลัก</span>
                <span className="text-sm font-normal text-muted-foreground">(จำเป็น)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">หัวข้องาน *</Label>
                  <Input
                    id="title"
                    placeholder={postingType === "hiring" ? "ต้องการคนทำ..." : "สามารถทำ..."}
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">รายละเอียด *</Label>
                  <Textarea
                    id="description"
                    placeholder={postingType === "hiring"
                      ? "รายละเอียดงานที่ต้องการจ้าง..."
                      : "ทักษะและประสบการณ์ที่สามารถทำได้..."
                    }
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">ประเภทงาน</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทงาน" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="urgency">ความเร่งด่วน</Label>
                    <Select value={urgency} onValueChange={(value) => {
                      setUrgency(value);
                      handleInputChange("urgency", value);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {URGENCY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {currentUrgency && (
                  <Badge className={currentUrgency.color}>
                    {currentUrgency.label}
                  </Badge>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wage-info" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <DollarSignIcon className="h-5 w-5" />
                <span>2. ค่าจ้างและเงื่อนไข</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="wageType">ประเภทค่าจ้าง</Label>
                    <Select value={wageType} onValueChange={(value) => {
                      setWageType(value);
                      handleInputChange("wage_type", value);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WAGE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {wageType !== "negotiable" && (
                    <div>
                      <Label htmlFor="wageAmount">จำนวนเงิน</Label>
                      <Input
                        id="wageAmount"
                        type="number"
                        placeholder="500"
                        value={formData.wage_amount || ""}
                        onChange={(e) => handleInputChange("wage_amount", parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="workLocationType">สถานที่ทำงาน</Label>
                    <Select value={workLocationType} onValueChange={(value) => {
                      setWorkLocationType(value);
                      handleInputChange("work_location_type", value);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_LOCATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="workDuration">ระยะเวลาทำงาน (ถ้ามี)</Label>
                  <Input
                    id="workDuration"
                    placeholder="เช่น 3 วัน, 2 สัปดาห์, ตลอดเวลา"
                    value={formData.work_duration || ""}
                    onChange={(e) => handleInputChange("work_duration", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">คุณสมบัติเพิ่มเติม</Label>
                  <Textarea
                    id="requirements"
                    placeholder="คุณสมบัติที่ต้องการหรือข้อกำหนดเพิ่มเติม..."
                    value={formData.requirements || ""}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>3. ทักษะที่เกี่ยวข้อง</span>
                <Badge variant="secondary" className="ml-2">{selectedSkills.length} รายการ</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {commonSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                คลิกที่ทักษะเพื่อเลือก/ยกเลิกการเลือก
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPinIcon className="h-5 w-5" />
                <span>4. สถานที่</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <LocationPicker
                value={location ? { lat: location.lat, lng: location.lng } : null}
                onChange={(coords) => setLocation(prev => ({ ...coords, address: prev?.address || "" }))}
                addressValue={location?.address || ""}
                onAddressChange={(addr) => setLocation(prev => prev ? { ...prev, address: addr } : { lat: 0, lng: 0, address: addr })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="images" className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>5. รูปภาพ (ถ้ามี)</span>
                <span className="text-sm font-normal text-muted-foreground">สูงสุด 5 รูป</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <ImageUpload
                value={formData.images || []}
                onChange={(images) => handleInputChange("images", images)}
                onRemove={(url) => handleInputChange("images", (formData.images || []).filter(img => img !== url))}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "กำลังบันทึก..." : "โพสต์งาน"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateJobPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateJobForm />
    </Suspense>
  );
}