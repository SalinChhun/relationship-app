'use client';

import {Suspense} from 'react';
import RelationshipApp from "@/app/ui/RelationshipApp";


export default function HomePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Loading your session...</p>
                    </div>
                </div>
            }
        >
            <RelationshipApp/>
        </Suspense>
    );
}