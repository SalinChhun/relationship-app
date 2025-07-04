'use client';

import {Suspense} from 'react';
import {AuthForm} from "@/app/ui/AuthForm";


export default function LoginPage() {
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
            <AuthForm/>
        </Suspense>
    );
}