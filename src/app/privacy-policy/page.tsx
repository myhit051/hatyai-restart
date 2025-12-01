import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
            <p className="text-gray-600 mb-4">อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">1. บทนำ</h2>
                    <p className="text-gray-700">
                        Hatyai Connect ("เรา") ให้ความสำคัญกับความเป็นส่วนตัวของคุณ นโยบายความเป็นส่วนตัวนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของคุณเมื่อคุณใช้งานเว็บไซต์และบริการของเรา
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. ข้อมูลที่เราเก็บรวบรวม</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>ข้อมูลที่ระบุตัวตนได้:</strong> เช่น ชื่อ, อีเมล, เบอร์โทรศัพท์ (เมื่อคุณสมัครสมาชิกหรือแจ้งเรื่อง)</li>
                        <li><strong>ข้อมูลการใช้งาน:</strong> เช่น ประวัติการเข้าชม, การคลิก, และข้อมูลทางเทคนิค (IP Address, Browser)</li>
                        <li><strong>คุกกี้ (Cookies):</strong> เราใช้คุกกี้เพื่อจดจำการตั้งค่าและการเข้าสู่ระบบของคุณ</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. การใช้งานคุกกี้ (Cookies)</h2>
                    <p className="text-gray-700 mb-2">
                        เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ โดยแบ่งเป็น:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>คุกกี้ที่จำเป็น (Strictly Necessary Cookies):</strong> จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ เช่น การเข้าสู่ระบบ</li>
                        <li><strong>คุกกี้เพื่อการวิเคราะห์ (Analytics Cookies):</strong> ช่วยให้เราเข้าใจว่าผู้ใช้ใช้งานเว็บไซต์อย่างไร เพื่อนำไปปรับปรุงบริการ (เช่น Google Analytics)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. การเปิดเผยข้อมูล</h2>
                    <p className="text-gray-700">
                        เราจะไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของคุณแก่บุคคลภายนอก ยกเว้นในกรณีที่จำเป็นต้องเปิดเผยตามกฎหมาย หรือเพื่อการดำเนินงานของโครงการ (เช่น ส่งข้อมูลแจ้งซ่อมให้หน่วยงานที่เกี่ยวข้อง)
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">5. สิทธิ์ของคุณ</h2>
                    <p className="text-gray-700">
                        คุณมีสิทธิ์ในการเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ รวมถึงสิทธิ์ในการถอนความยินยอมในการใช้คุกกี้ที่ไม่จำเป็นได้ตลอดเวลา
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">6. ติดต่อเรา</h2>
                    <p className="text-gray-700">
                        หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเราได้ที่: [ใส่อีเมลหรือช่องทางติดต่อ]
                    </p>
                </section>
            </div>
        </div>
    );
}
