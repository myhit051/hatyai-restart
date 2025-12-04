"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value = [],
    onChange,
    onRemove
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages: string[] = [];
        const maxFileSize = 5 * 1024 * 1024; // 5MB limit before compression

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.size > maxFileSize) {
                    toast({
                        title: "ไฟล์มีขนาดใหญ่เกินไป",
                        description: `รูปภาพ ${file.name} มีขนาดใหญ่กว่า 5MB`,
                        variant: "destructive"
                    });
                    continue;
                }

                // Compress and convert to Base64
                const base64 = await compressImage(file);
                newImages.push(base64);
            }

            onChange([...value, ...newImages]);
        } catch (error) {
            console.error("Error processing images:", error);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถอัปโหลดรูปภาพได้",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    // Max dimensions
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
                {value.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-md overflow-hidden shrink-0 border border-gray-200">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={onUpload}
                className="hidden"
                accept="image/*"
                multiple
            />

            <Button
                type="button"
                variant="secondary"
                onClick={triggerUpload}
                disabled={isUploading}
            >
                {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    <ImagePlus className="h-4 w-4 mr-2" />
                )}
                {isUploading ? "กำลังประมวลผล..." : "อัปโหลดรูปภาพ"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
                รองรับไฟล์รูปภาพ (JPG, PNG) ขนาดไม่เกิน 5MB
            </p>
        </div>
    );
}

export default ImageUpload;
