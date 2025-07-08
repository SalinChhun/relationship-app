import type React from "react";
import {Heart} from "lucide-react";

export const FriendsPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Connections</h2>
                {/*{relationships.length === 0 ? (
                    <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-2"/>
                        <p className="text-gray-500">No connections yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {relationships.map((relationship) => {
                            const relationshipData = getRelationshipTypeData(relationship.relationshipType)
                            return (
                                <div key={relationship.id}
                                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {relationship.partner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{relationship.partner.name}</h3>
                                            <p className="text-sm text-gray-600">{relationshipData.emoji} {relationshipData.label}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}*/}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Discover People</h2>
                <div className="grid grid-cols-2 gap-3">
                    {/*{users.filter(u => !relationships.some(r => r.partnerId === u.id)).map((user) => (
                        <div key={user.id} className="bg-gray-50 rounded-lg p-3 text-center">
                            <div
                                className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                                {user.name.charAt(0)}
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">{user.name}</h3>
                            <p className="text-xs text-gray-600">{user.age} years old</p>
                        </div>
                    ))}*/}
                </div>
            </div>
        </div>
    )
}