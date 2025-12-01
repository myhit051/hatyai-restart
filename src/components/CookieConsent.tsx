'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Script from 'next/script'
import Link from 'next/link'

interface CookieConsentProps {
    gaId?: string
}

export default function CookieConsent({ gaId }: CookieConsentProps) {
    const [showBanner, setShowBanner] = useState(false)
    const [consent, setConsent] = useState<boolean>(false)

    useEffect(() => {
        // Check if user has already made a choice
        const stored = localStorage.getItem('cookie_consent')

        if (stored === 'granted') {
            setConsent(true)
        } else if (stored === null) {
            // If no choice made yet, show banner
            setShowBanner(true)
        }
    }, [])

    const accept = () => {
        localStorage.setItem('cookie_consent', 'granted')
        setConsent(true)
        setShowBanner(false)
    }

    const decline = () => {
        localStorage.setItem('cookie_consent', 'denied')
        setConsent(false)
        setShowBanner(false)
    }

    return (
        <>
            {/* Google Analytics Scripts - Only load if consent is granted */}
            {consent && gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
                    </Script>
                </>
            )}

            {/* Consent Banner */}
            {showBanner && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-full duration-300">
                    <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1 pr-8">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">
                                เราใช้คุกกี้ (Cookies)
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                เว็บไซต์นี้ใช้คุกกี้เพื่อเพิ่มประสิทธิภาพและประสบการณ์ที่ดีในการใช้งานเว็บไซต์
                                รวมถึงเพื่อวิเคราะห์การเข้าชมเว็บไซต์ ท่านสามารถศึกษารายละเอียดเพิ่มเติมได้ที่{' '}
                                <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
                                    นโยบายความเป็นส่วนตัว
                                </Link>
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                            <Button
                                variant="outline"
                                onClick={decline}
                                className="flex-1 md:flex-none whitespace-nowrap"
                            >
                                ปฏิเสธทั้งหมด
                            </Button>
                            <Button
                                onClick={accept}
                                className="flex-1 md:flex-none whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                ยอมรับทั้งหมด
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
