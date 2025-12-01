"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AuthLayout from "@/components/AuthLayout";
import SearchParamsProvider from "@/components/SearchParamsProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const Login = () => {
    const { login, loginWithGoogle } = useAuthStore();
    const router = useRouter();

    return (
        <SearchParamsProvider>
            <LoginContent
                login={login}
                loginWithGoogle={loginWithGoogle}
                router={router}
            />
        </SearchParamsProvider>
    );
};

const LoginContent: React.FC<{
    login: any;
    loginWithGoogle: any;
    router: any;
}> = ({ login, loginWithGoogle, router }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    // Get the location they were trying to go to
    const from = searchParams?.get("from") || "/";

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
            title="ยินดีต้อนรับกลับมา"
            subtitle="เข้าสู่ระบบเพื่อดำเนินการต่อ"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">อีเมล</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">รหัสผ่าน</Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                ลืมรหัสผ่าน?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-10"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                    >
                        จดจำฉันไว้ในระบบ
                    </label>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
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

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">
                            หรือดำเนินการต่อด้วย
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full relative hover:bg-gray-50 border-gray-200 text-gray-700"
                    onClick={() => loginWithGoogle()}
                    disabled={isLoading}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        <path fill="#34A853" d="M248 504c66.1 0 121.6-21.8 162-60.8l-67.5-64.9c-20.3 13.6-46.3 21.6-76.5 21.6-58.9 0-108.9-39.8-126.7-93.3H16.7v63.3C59.6 456.8 147.2 504 248 504z"></path>
                        <path fill="#FBBC05" d="M121.3 306.6c-4.7-14.1-7.4-29.3-7.4-45.1s2.7-31 7.4-45.1V152.9H16.7C6 174.3 0 199.6 0 256s6 81.7 16.7 103.1l104.6-52.5z"></path>
                        <path fill="#EA4335" d="M248 93.3c35.8 0 68 12.3 93.3 36.5l69.9-69.9C369.1 20.9 314.1 0 248 0 147.2 0 59.6 47.2 16.7 129.9l104.6 52.5c17.8-53.5 67.8-93.3 126.7-93.3z"></path>
                    </svg>
                    Google
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    ยังไม่มีบัญชี?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        สมัครสมาชิก
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;
