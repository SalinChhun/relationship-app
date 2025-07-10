import React, {useState} from "react";
import {Heart, X} from "lucide-react";
import {UserType} from "@/app/types/user";
import usePostMutation from "@/lib/hooks/post-mutation";
import ImageUpload from "@/app/components/ImageUpload";


interface PostFormData {
    userId: string;
    content: string;
}

interface CreatePostProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserType | null;
}

export const CreatePost: React.FC<CreatePostProps> = ({
                                                          isOpen,
                                                          onClose,
                                                          currentUser
                                                      }) => {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [postForm, setPostForm] = useState<PostFormData>({
        userId: "",
        content: "",
    });

    const [isUploading, setIsUploading] = useState(false);
    const createPostMutation = usePostMutation.useCreatePost();

    const handleSubmit = async () => {

        if (!currentUser) {
            alert("Login User not found");
            return;
        }
        try {

            setIsUploading(true);

            const uploadedImages: { imageUrl: string; caption: string; order: number }[] = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                console.log("Uploading file:", file.name);

                // Get ImageKit auth
                const authRes = await fetch("/api/imagekit-auth");
                const {signature, expire, token} = await authRes.json();

                const formData = new FormData();
                formData.append("file", file);
                formData.append("fileName", file.name);
                formData.append("useUniqueFileName", "true");
                formData.append("publicKey", process.env.NEXT_PUBLIC_PUBLIC_KEY!);
                formData.append("signature", signature);
                formData.append("expire", expire);
                formData.append("token", token);

                const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) throw new Error("Upload failed");

                const uploadData = await uploadRes.json();
                uploadedImages.push({
                    imageUrl: uploadData.url,
                    caption: "",
                    order: i,
                });
            }

            const requestBody: any = {
                userId: currentUser.id,
                content: postForm.content,
                images: uploadedImages
            };

            console.log("Request Body:", requestBody);

            createPostMutation.mutation(requestBody, {
                onSuccess: () => {
                    onClose();
                    // Reset form
                    setPostForm({
                        userId: "",
                        content: "",
                    });
                    setIsUploading(false);
                },
                onError: (error) => {
                    setIsUploading(false);
                },
            });
        } catch (error) {
            console.error("Error creating relationship:", error);
            alert("Failed to create relationship. Please try again.");
            setIsUploading(false);
        } finally {

        }
    };

    const handleClose = () => {

        setPostForm({
            userId: "",
            content: "",
        });
        onClose();

    };


    if (!isOpen) return null;

    const isLoading = isUploading || createPostMutation.isLoading;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white" fill="currentColor"/>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Add New Post</h2>
                            <p className="text-sm text-gray-600">Share your love story with everyone</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5 text-gray-500"/>
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Post Title - Facebook style at the top */}
                    <div>
                    <textarea
                        value={postForm.content}
                        onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                        placeholder="What's on your mind?"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-lg text-gray-900 placeholder-gray-500 transition resize-none"
                        rows={3}
                    />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <ImageUpload onFilesSelected={setSelectedFiles}/>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                "Post"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};