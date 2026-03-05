"use client";

import React, { useState, useRef } from "react";

interface ImageUploadProps {
    currentUrl?: string | null;
    onUpload: (file: File) => void;
    label?: string;
}

export default function ImageUpload({
    currentUrl,
    onUpload,
    label = "Upload Image",
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onUpload(file);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {label}
            </label>
            <div
                onClick={() => inputRef.current?.click()}
                className={`relative w-full h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:bg-gold/5 flex items-center justify-center overflow-hidden ${preview ? "border-gold/50" : "border-white/10"
                    }`}
            >
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-center">
                        <svg
                            className="w-8 h-8 mx-auto text-gold/40 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-text-muted text-sm">
                            Click to <span className="text-gold">upload</span>
                        </p>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}
