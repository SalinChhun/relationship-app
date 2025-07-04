import { NextRequest, NextResponse } from 'next/server';
import { initializeDefaultData } from '@/scripts/initializeData';

export async function POST(request: NextRequest) {
    try {
        await initializeDefaultData();
        return NextResponse.json({ message: 'Data initialized successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error initializing data:', error);
        return NextResponse.json({ error: 'Failed to initialize data' }, { status: 500 });
    }
}

// Optional: Handle other HTTP methods
export async function GET(request: NextRequest) {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}