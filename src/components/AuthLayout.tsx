import React from "react";
import Link from "next/link";
import { Shield, Waves } from "lucide-react";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Waves className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">หาดใหญ่ Restart</h1>
                    <p className="text-sm text-gray-600 text-center">{subtitle}</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center mb-6">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>

                    {children}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        ← กลับหน้าแรก
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;