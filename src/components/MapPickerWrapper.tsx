"use client";

import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./MapPicker"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            <p>กำลังโหลดแผนที่...</p>
        </div>
    ),
});

export default MapPicker;
