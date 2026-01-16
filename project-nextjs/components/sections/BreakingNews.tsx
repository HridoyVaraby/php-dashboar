'use client';

import { usePosts } from '@/hooks/use-posts';
import Link from 'next/link';

const BreakingNews = () => {
    const { data: latestNews } = usePosts({ limit: 10 });

    // Fallback to dummy data if no news available
    const newsItems = latestNews && latestNews.length > 0
        ? latestNews.map(post => ({ title: post.title, id: post.id }))
        : [
            { title: "সরকারি নতুন নীতি ঘোষণা: শিক্ষাক্ষেত্রে বড় পরিবর্তন আসছে", id: "1" },
            { title: "জলবায়ু পরিবর্তন: বাংলাদেশে নতুন প্রভাব দেখা দিচ্ছে", id: "2" },
            { title: "অর্থনৈতিক প্রবৃদ্ধি: চলতি বছরে ৮% লক্ষ্যমাত্রা অর্জনের সম্ভাবনা", id: "3" },
            { title: "প্রযুক্তি খাতে নতুন বিনিয়োগ: স্টার্টআপদের জন্য সুযোগ সৃষ্টি", id: "4" }
        ];

    return (
        <div className="bg-red-600 text-white py-2 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center">
                    <span className="bg-white text-red-600 px-3 py-1 text-sm font-bold mr-4 whitespace-nowrap flex-shrink-0 z-10">
                        ব্রেকিং নিউজ
                    </span>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex animate-slide-left whitespace-nowrap pl-4">
                            {newsItems.map((news, index) => (
                                <Link key={index} href={latestNews && latestNews.length > 0 ? `/post/${news.id}` : '#'} className="mx-8 cursor-pointer hover:underline">
                                    {news.title}
                                </Link>
                            ))}
                            {/* Duplicate for seamless loop */}
                            {newsItems.map((news, index) => (
                                <Link key={`duplicate-${index}`} href={latestNews && latestNews.length > 0 ? `/post/${news.id}` : '#'} className="mx-8 cursor-pointer hover:underline">
                                    {news.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreakingNews;
