"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login, loginWithGoogle } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get the location they were trying to go to
    const from = searchParams.get("from") || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                router.push(from);
            } else {
                setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="เข้าสู่ระบบ"
            subtitle="เข้าสู่ระบบเพื่อเริ่มต้นการช่วยเหลือและฟื้นฟูหาดใหญ่"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">รหัสผ่าน</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังเข้าสู่ระบบ...
                        </>
                    ) : (
                        "เข้าสู่ระบบ"
                    )}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            หรือ
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full relative text-[#4285F4] hover:text-[#4285F4] hover:bg-blue-50 border-blue-100"
                    onClick={() => loginWithGoogle()}
                    disabled={isLoading}
                >
                    <svg className="mr-2 h-4 w-4 absolute left-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    เข้าสู่ระบบด้วย <span className="font-bold ml-1">Google</span>
                </Button>

                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        ยังไม่มีบัญชี?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline"
                        >
                            สมัครสมาชิก
                        </Link>
                    </p>

                    <div className="text-xs text-muted-foreground">
                        <p className="font-medium">บัญชีทดสอบ:</p>
                        <p>อีเมล: test@hatyai.restart</p>
                        <p>รหัสผ่าน: 123456</p>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
