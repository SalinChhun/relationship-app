"use client";
import {useRef, useState} from "react";
import { X, Plus, Camera } from "lucide-react";

export default function ImageUpload({onFilesSelected}: { onFilesSelected: (files: File[]) => void }) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<{url: string, file: File}[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type));

        const newPreviews = validFiles.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));

        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);
        onFilesSelected(updatedPreviews.map(p => p.file));
    };

    const removeImage = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
        onFilesSelected(updatedPreviews.map(p => p.file));

        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addMoreImages = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
            />

            {previews.length === 0 ? (
                // Initial upload area
                <div
                    onClick={addMoreImages}
                    className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <Camera className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-700 font-medium text-lg mb-1">Add photos</p>
                    <p className="text-gray-500 text-sm">or drag and drop</p>
                </div>
            ) : (
                // Preview grid
                <div className="space-y-3">
                    <div className="grid gap-2" style={{
                        gridTemplateColumns: previews.length === 1 ? '1fr' :
                            previews.length === 2 ? 'repeat(2, 1fr)' :
                                previews.length === 3 ? 'repeat(3, 1fr)' :
                                    'repeat(2, 1fr)'
                    }}>
                        {previews.slice(0, 4).map((preview, idx) => (
                            <div
                                key={idx}
                                className="relative group overflow-hidden rounded-lg bg-gray-100"
                                style={{
                                    aspectRatio: previews.length === 1 ? '16/9' : '1/1',
                                    gridRow: previews.length === 3 && idx === 0 ? 'span 2' : 'span 1'
                                }}
                            >
                                <img
                                    src={preview.url}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {/* Remove button */}
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>

                                {/* Overlay for extra images */}
                                {idx === 3 && previews.length > 4 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white text-xl font-semibold">
                                            +{previews.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add more button */}
                    <button
                        onClick={addMoreImages}
                        className="w-full h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <Plus className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="text-gray-600 font-medium">Add more photos</span>
                    </button>
                </div>
            )}

            {previews.length > 0 && (
                <div className="mt-3 text-sm text-gray-500">
                    {previews.length} photo{previews.length > 1 ? 's' : ''} selected
                </div>
            )}
        </div>
    );
}