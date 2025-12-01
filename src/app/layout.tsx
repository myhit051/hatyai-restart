import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Hatyai Connect",
    description: "แพลตฟอร์ม Hatyai Connect ขับเคลื่อนโครงการ Hat Yai Restart - แจ้งซ่อม, รายงานขยะ, และบริจาคทรัพยากร",
    icons: {
        icon: [
            { url: "https://res.cloudinary.com/dhoufeuyr/image/upload/w_32,h_32,c_fill,f_auto,q_auto/v1764490976/hytt_vru24n.png", sizes: "32x32", type: "image/png" },
            { url: "https://res.cloudinary.com/dhoufeuyr/image/upload/w_192,h_192,c_fill,f_auto,q_auto/v1764490976/hytt_vru24n.png", sizes: "192x192", type: "image/png" },
        ],
        apple: [
            { url: "https://res.cloudinary.com/dhoufeuyr/image/upload/w_180,h_180,c_fill,f_auto,q_auto/v1764490976/hytt_vru24n.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/manifest.json",
};

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AuthInitializer from "@/components/AuthInitializer";
import CookieConsent from "@/components/CookieConsent";

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
                    <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
                </Providers>
            </body>
        </html>
    );
}
