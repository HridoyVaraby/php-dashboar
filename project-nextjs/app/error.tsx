'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">কিছু ভুল হয়েছে!</h2>
                <p className="text-gray-600 mb-8">
                    দুঃখিত, একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। আমরা সমস্যাটি সমাধান করার চেষ্টা করছি।
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    আবার চেষ্টা করুন
                </button>
            </div>
        </div>
    );
}
