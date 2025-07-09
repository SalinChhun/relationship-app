import React, {useState} from "react";
import {Heart, X} from "lucide-react";
import usersMutation from "@/lib/hooks/users-mutation";
import {relationshipTypes} from "@/utils/utils";
import {RelationshipType} from "@prisma/client";
import useRelationshipMutation from "@/lib/hooks/relationships-mutation";
import {RelationshipRequest} from "@/app/types/relationship";
import {UserType} from "@/app/types/user";


interface RelationshipFormData {
    partnerId: string;
    relationshipType: RelationshipType;
}

interface CreateRelationshipProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserType | null;
}

export const CreateRelationship: React.FC<CreateRelationshipProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          currentUser
                                                                      }) => {
    const [relationshipForm, setRelationshipForm] = useState<RelationshipFormData>({
        partnerId: "",
        relationshipType: RelationshipType.IN_RELATIONSHIP,
    });

    const {users, isLoading} = usersMutation.useFetchUsers();
    if (!users?.data || !currentUser) return null;

    const relationshipMutation = useRelationshipMutation.useCreateRelationship();

    const handleSubmit = async () => {

        if (!currentUser) {
            alert("Login User not found");
            return;
        }
        try {

            const requestBody: RelationshipRequest = {
                userId: currentUser.id,
                partnerRequests: [
                    {
                        id: relationshipForm.partnerId ? parseInt(relationshipForm.partnerId) : null,
                        relationshipType: relationshipForm.relationshipType,
                    },
                ],
            };
            relationshipMutation.mutation(requestBody, {
                onSuccess: () => {
                    onClose();
                    // Reset form
                    setRelationshipForm({
                        partnerId: "",
                        relationshipType: RelationshipType.IN_RELATIONSHIP,
                    });
                }
            });

        } catch (error) {
            console.error("Error creating relationship:", error);
            alert("Failed to create relationship. Please try again.");
        } finally {

        }
    };

    const handleClose = () => {

        setRelationshipForm({
            partnerId: "",
            relationshipType: RelationshipType.IN_RELATIONSHIP,
        });
        onClose();

    };

    // Filter out users who already have relationships and the current user
    const availableUsers = users?.data.filter((user: any) =>
        user?.id !== currentUser?.id
    );

    if (!isOpen) return null;

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
                            <h2 className="text-xl font-bold text-gray-900">Add New Relationship</h2>
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

                    {/* Relationship Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Relationship Type
                        </label>
                        <select
                            value={relationshipForm.relationshipType}
                            onChange={(e) => setRelationshipForm(prev => ({
                                ...prev,
                                relationshipType: e.target.value as RelationshipType
                            }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                        >
                            {relationshipTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.emoji} {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Partner Selection */}
                    {
                        relationshipForm.relationshipType !== RelationshipType.SINGLE &&
                        relationshipForm.relationshipType !== RelationshipType.SITUATIONSHIP && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Choose Your Partner
                                </label>
                                <select
                                    value={relationshipForm.partnerId}
                                    onChange={(e) => setRelationshipForm(prev => ({
                                        ...prev,
                                        partnerId: e.target.value
                                    }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Select someone special...</option>
                                    {availableUsers.map((user: any) => (
                                        <option key={user?.id} value={user?.id.toString()}>
                                            {user?.name} (@{user?.username}) - {user?.age} years old
                                        </option>
                                    ))}
                                </select>
                                {availableUsers.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        No available users to connect with at the moment.
                                    </p>
                                )}
                            </div>
                        )
                    }

                    {/* Preview */}
                    {relationshipForm.partnerId && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {currentUser?.name ? currentUser?.name.charAt(0) : ""}
                                    </div>
                                    <span className="text-sm font-medium">{currentUser?.name}</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="text-xl">
                                        {relationshipTypes.find(t => t.value === relationshipForm.relationshipType)?.emoji}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {relationshipTypes.find(t => t.value === relationshipForm.relationshipType)?.label}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                        {users?.data.find((u: any) => u?.id === parseInt(relationshipForm.partnerId))?.name}
                                    </span>
                                    <div
                                        className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {users?.data.find((u: any) => u?.id === parseInt(relationshipForm.partnerId))?.name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                            {relationshipMutation.isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                "Share"
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};