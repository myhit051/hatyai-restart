"use client";

import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    return (
        <AuthLayout
            title="ลืมรหัสผ่าน?"
            subtitle="ไม่ต้องกังวล เราจะส่งคำแนะนำในการตั้งรหัสผ่านใหม่ให้คุณ"
        >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    ส่งคำขอรีเซ็ตรหัสผ่าน
                </Button>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        กลับไปหน้าเข้าสู่ระบบ
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
