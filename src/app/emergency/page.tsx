"use client";

import { Phone, Ambulance, ShieldAlert, FireExtinguisher } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmergencyPage() {
    const emergencyContacts = [
        { name: "หน่วยกู้ชีพหาดใหญ่", number: "1669", icon: Ambulance, color: "text-red-600", bg: "bg-red-100" },
        { name: "แจ้งเหตุด่วนเหตุร้าย", number: "191", icon: ShieldAlert, color: "text-blue-600", bg: "bg-blue-100" },
        { name: "ดับเพลิง", number: "199", icon: FireExtinguisher, color: "text-orange-600", bg: "bg-orange-100" },
        { name: "สายด่วนน้ำท่วม", number: "1111", icon: Phone, color: "text-blue-500", bg: "bg-blue-50" },
    ];

    return (
        <div className="min-h-screen bg-background pb-28">
            <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
                <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                    <Phone className="w-6 h-6" />
                    เบอร์โทรฉุกเฉิน
                </h1>

                <div className="grid gap-4">
                    {emergencyContacts.map((contact, index) => {
                        const Icon = contact.icon;
                        return (
                            <Card key={index} className="p-4 flex items-center justify-between border-l-4 border-l-red-500 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full ${contact.bg} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${contact.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                                        <p className="text-xl font-bold text-gray-700">{contact.number}</p>
                                    </div>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => window.open(`tel:${contact.number}`)}>
                                    โทรออก
                                </Button>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
