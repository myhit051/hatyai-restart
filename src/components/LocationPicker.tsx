"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPinIcon, GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import MapPickerWrapper from "./MapPickerWrapper";

interface LocationPickerProps {
    value: { lat: number; lng: number } | null;
    onChange: (location: { lat: number; lng: number }) => void;
    addressValue?: string;
    onAddressChange?: (address: string) => void;
}

const LocationPicker = ({ value, onChange, addressValue, onAddressChange }: LocationPickerProps) => {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const handleGetCurrentLocation = () => {
        setIsLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    onChange({ lat: latitude, lng: longitude });
                    setIsLoadingLocation(false);
                    // Optional: Reverse geocoding here to get address
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("ไม่สามารถรับพิกัดปัจจุบันได้ กรุณาตรวจสอบการอนุญาตใช้งาน GPS");
                    setIsLoadingLocation(false);
                }
            );
        } else {
            alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
            setIsLoadingLocation(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                >
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {isLoadingLocation ? "กำลังค้นหา..." : "ใช้ตำแหน่งปัจจุบัน"}
                </Button>

                <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" className="flex-1">
                            <GlobeAsiaAustraliaIcon className="h-4 w-4 mr-2" />
                            ปักหมุดบนแผนที่
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>เลือกตำแหน่งบนแผนที่</DialogTitle>
                            <DialogDescription>
                                คลิกบนแผนที่เพื่อเลือกตำแหน่งที่ต้องการ
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 min-h-0 relative border rounded-md overflow-hidden">
                            <MapPickerWrapper
                                initialPosition={value}
                                onLocationSelect={(lat, lng) => onChange({ lat, lng })}
                            />
                        </div>
                        <div className="pt-2 flex justify-end">
                            <Button onClick={() => setIsMapOpen(false)}>ยืนยันตำแหน่ง</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {value && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-600">✓ ได้รับพิกัดแล้ว:</span>
                    {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                </div>
            )}

            {onAddressChange && (
                <Input
                    value={addressValue}
                    onChange={(e) => onAddressChange(e.target.value)}
                    placeholder="ระบุรายละเอียดสถานที่เพิ่มเติม (เช่น บ้านเลขที่, จุดสังเกต)"
                />
            )}
        </div>
    );
};

export default LocationPicker;
