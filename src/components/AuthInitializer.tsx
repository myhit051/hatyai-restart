"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthInitializer() {
    const { checkSession } = useAuthStore();

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    return null;
}
