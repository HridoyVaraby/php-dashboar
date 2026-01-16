'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Video, MessageSquare, Users, Eye, Calendar, TrendingUp, Tag } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    posts: number;
    videos: number;
    opinions: number;
    comments: number;
    users: number;
    categories: number;
    views: number;
    recentPosts: number;
}

export default function AdminDashboard() {
    const { data: stats, isLoading } = useQuery<Stats>({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await fetch('/api/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
        },
    });

    const statsCards = [
        {
            title: 'মোট পোস্ট',
            value: stats?.posts || 0,
            icon: FileText,
            color: 'bg-blue-500',
            link: '/admin/posts',
        },
        {
            title: 'মোট ভিডিও',
            value: stats?.videos || 0,
            icon: Video,
            color: 'bg-purple-500',
            link: '/admin/videos',
        },
        {
            title: 'মোট মতামত',
            value: stats?.opinions || 0,
            icon: TrendingUp,
            color: 'bg-green-500',
            link: '/admin/opinions',
        },
        {
            title: 'মোট মন্তব্য',
            value: stats?.comments || 0,
            icon: MessageSquare,
            color: 'bg-yellow-500',
            link: '/admin/comments',
        },
        {
            title: 'মোট ইউজার',
            value: stats?.users || 0,
            icon: Users,
            color: 'bg-red-500',
            link: '/admin/users',
        },
        {
            title: 'ক্যাটেগরি',
            value: stats?.categories || 0,
            icon: Tag,
            color: 'bg-indigo-500',
            link: '/admin/categories',
        },
    ];

    const quickActions = [
        {
            title: 'নতুন পোস্ট তৈরি করুন',
            description: 'একটি নতুন সংবাদ পোস্ট যোগ করুন',
            link: '/admin/posts/create',
            icon: FileText,
        },
        {
            title: 'নতুন ভিডিও যোগ করুন',
            description: 'একটি নতুন ভিডিও আপলোড করুন',
            link: '/admin/videos/create',
            icon: Video,
        },
        {
            title: 'মন্তব্য মডারেট করুন',
            description: 'পেন্ডিং মন্তব্য পর্যালোচনা করুন',
            link: '/admin/comments',
            icon: MessageSquare,
        },
        {
            title: 'ক্যাটেগরি ম্যানেজ করুন',
            description: 'ক্যাটেগরি এবং সাবক্যাটেগরি পরিচালনা করুন',
            link: '/admin/categories',
            icon: Tag,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
                <p className="text-gray-600 mt-2">স্বাগতম অ্যাডমিন প্যানেলে</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    statsCards.map((stat, index) => (
                        <Link href={stat.link} key={index}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.color} p-3 rounded-lg`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">দ্রুত অ্যাকশন</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.link}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-500" />
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-500">
                                        {action.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">সাম্প্রতিক কার্যকলাপ</CardTitle>
                </CardHeader>
                <CardContent>
                    <RecentActivity />
                </CardContent>
            </Card>
        </div>
    );
}

function RecentActivity() {
    const { data: activity, isLoading } = useQuery({
        queryKey: ['recent-activity'],
        queryFn: async () => {
            const response = await fetch('/api/recent-activity');
            if (!response.ok) throw new Error('Failed to fetch activity');
            return response.json();
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!activity || activity.length === 0) {
        return (
            <p className="text-gray-600 text-center py-8">
                কোন সাম্প্রতিক কার্যকলাপ নেই
            </p>
        );
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'post':
                return <FileText className="w-5 h-5 text-blue-500" />;
            case 'comment':
                return <MessageSquare className="w-5 h-5 text-yellow-500" />;
            case 'user':
                return <Users className="w-5 h-5 text-green-500" />;
            case 'video':
                return <Video className="w-5 h-5 text-purple-500" />;
            default:
                return <Calendar className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return 'এইমাত্র';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} মিনিট আগে`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ঘণ্টা আগে`;
        return `${Math.floor(diffInSeconds / 86400)} দিন আগে`;
    };

    return (
        <div className="space-y-4">
            {activity.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">
                            {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {item.description} • {getTimeAgo(item.createdAt)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
