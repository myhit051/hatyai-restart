import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the location they were trying to go to
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
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

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{" "}
            <Link
              to="/register"
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