'use client';

import { useAds } from '@/hooks/use-ads';

interface AdBannerProps {
    location?: string;
    className?: string;
}

const AdBanner = ({ location = 'homepage', className = "" }: AdBannerProps) => {
    const { data: ads, isLoading } = useAds(location);

    if (isLoading) {
        return (
            <div className={`container mx-auto px-4 py-8 ${className}`}>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center animate-pulse">
                    <div className="text-gray-400">
                        <div className="text-lg font-medium mb-2">লোড হচ্ছে...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!ads || ads.length === 0) {
        return (
            <div className={`container mx-auto px-4 py-8 ${className}`}>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-gray-500">
                        <div className="text-lg font-medium mb-2">বিজ্ঞাপনের স্থান</div>
                        <div className="text-sm">Ad Space Available</div>
                        <div className="text-xs mt-2">৭২৮ x ৯০ পিক্সেল</div>
                    </div>
                </div>
            </div>
        );
    }

    // Show the first active ad for this location
    const ad = ads[0];

    return (
        <div className={`container mx-auto px-4 py-8 ${className}`}>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-90 transition-opacity"
                >
                    <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-auto max-h-[200px] object-contain"
                    />
                </a>
                <div className="px-2 py-1 text-xs text-gray-500 text-center">
                    বিজ্ঞাপন
                </div>
            </div>
        </div>
    );
};

export default AdBanner;
