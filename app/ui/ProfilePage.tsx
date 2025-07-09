import React from "react";
import {UserType} from "@/app/types/user";
import {CreateRelationship} from "@/app/ui/CreateRelationship";

interface ProfileProps {
    isOpenCreateRelationship: boolean;
    setIsOpenCreateRelationShip: () => void;
    onCloseCreateRelationShip: () => void;
    currentUser: UserType | null;
}

export const ProfilePage: React.FC<ProfileProps> = ({
                                                        isOpenCreateRelationship,
                                                        setIsOpenCreateRelationShip,
                                                        onCloseCreateRelationShip,
                                                        currentUser
                                                   }) => {


    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="text-center mb-6">
                    <div
                        className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        {currentUser?.name ? currentUser.name.charAt(0) : ""}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentUser?.name}</h2>
                    <p className="text-gray-600">@{currentUser?.username}</p>
                    <p className="text-gray-600">{currentUser?.age} years old</p>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Relationship Status</h3>
                    <p className="text-gray-700">
                        {/*{relationships.length === 0 ? "Single" : `${relationships.length} Active ${relationships.length === 1 ? 'Relationship' : 'Relationships'}`}*/}
                    </p>
                </div>

                <button
                    onClick={() => setIsOpenCreateRelationShip()}
                    className="mb-4 w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all">
                    Add Relationship
                </button>

                <button
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all">
                    Edit Profile
                </button>
            </div>

            {/* Add Relationship Modal */}
            <CreateRelationship isOpen={isOpenCreateRelationship} onClose={() => onCloseCreateRelationShip()} currentUser={currentUser}/>
        </div>
    );
}