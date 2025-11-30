"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const Map = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            <p>กำลังโหลดแผนที่...</p>
        </div>
    ),
});

export default Map;
