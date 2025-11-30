import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-primary mx-auto flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">HY</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Hat Yai Restart - แพลตฟอร์มฟื้นฟูหาดใหญ่
          </p>
          <p className="mt-1">
            ร่วมกันสร้างความแข็งแกร่งให้ชุมชน
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;