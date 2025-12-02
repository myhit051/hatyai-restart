"use client";

import { MousePointerClick, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
    {
        icon: MousePointerClick,
        title: "เลือกบริการ",
        description: "เลือกเมนูที่คุณต้องการความช่วยเหลือ",
        color: "text-blue-600",
        bg: "bg-blue-100"
    },
    {
        icon: FileText,
        title: "ระบุข้อมูล",
        description: "กรอกรายละเอียดและตำแหน่ง",
        color: "text-orange-600",
        bg: "bg-orange-100"
    },
    {
        icon: CheckCircle2,
        title: "ติดตามผล",
        description: "ดูสถานะการดำเนินการได้ทันที",
        color: "text-green-600",
        bg: "bg-green-100"
    }
];

const HowItWorks = () => {
    return (
        <section className="relative">
            <h2 className="text-lg font-semibold text-foreground mb-3">
                เริ่มต้นใช้งานง่ายๆ
            </h2>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-[28px] left-[16%] right-[16%] h-[2px] bg-muted-foreground/20 -z-10" />

                <div className="grid grid-cols-3 gap-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <Card
                                key={index}
                                className="p-3 flex flex-col items-center text-center border shadow-sm hover:shadow-md transition-shadow animate-fade-in bg-card"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.bg} ${step.color} ring-4 ring-card z-10`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-[10px] text-muted-foreground leading-tight">
                                    {step.description}
                                </p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
