"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from 'next/image';

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
    const onUpload = (result: any) => {
        onChange([...value, result.info.secure_url]);
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 overflow-x-auto">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden shrink-0">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
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
            <CldUploadWidget
                onSuccess={onUpload}
                uploadPreset="hatyai-restart" // You need to create this unsigned preset in Cloudinary
                options={{
                    sources: ['local', 'camera'],
                    multiple: true,
                    maxFiles: 5,
                    resourceType: "image"
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        open();
                    };

                    return (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            อัปโหลดรูปภาพ
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}

export default ImageUpload;
