import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Hat Yai Restart",
    description: "Hat Yai Restart Project",
};

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthInitializer from "@/components/AuthInitializer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <AuthInitializer />
                    <Header />
                    {children}
                    <BottomNav />
                </Providers>
            </body>
        </html>
    );
}
