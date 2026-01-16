'use client';

import { useAds } from '@/hooks/use-ads';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function AdminAdsPage() {
    const { data: ads, isLoading } = useAds();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/ads/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete ad');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ads'] });
            toast({
                title: 'সফল!',
                description: 'বিজ্ঞাপন ডিলিট হয়েছে।',
            });
        },
        onError: () => {
            toast({
                title: 'ত্রুটি',
                description: 'বিজ্ঞাপন ডিলিট করতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const response = await fetch(`/api/ads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive }),
            });
            if (!response.ok) throw new Error('Failed to update ad status');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ads'] });
            toast({
                title: 'সফল!',
                description: 'বিজ্ঞাপনের স্ট্যাটাস আপডেট হয়েছে।',
            });
        },
    });

    const handleDelete = (id: string) => {
        if (confirm('আপনি কি নিশ্চিত যে আপনি এই বিজ্ঞাপনটি ডিলিট করতে চান?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleToggleActive = (id: string, currentStatus: boolean) => {
        toggleMutation.mutate({ id, isActive: !currentStatus });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">বিজ্ঞাপন ম্যানেজমেন্ট</h1>
                    <p className="text-gray-600 mt-1">সকল বিজ্ঞাপন দেখুন এবং পরিচালনা করুন</p>
                </div>
                <Button asChild>
                    <Link href="/admin/ads/create">
                        <Plus className="w-4 h-4 mr-2" />
                        নতুন বিজ্ঞাপন
                    </Link>
                </Button>
            </div>

            {/* Ads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        লোড হচ্ছে...
                    </div>
                ) : ads && ads.length > 0 ? (
                    ads.map((ad: any) => (
                        <div key={ad.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="aspect-video bg-gray-100 relative group">
                                {ad.imageUrl ? (
                                    <img
                                        src={ad.imageUrl}
                                        alt={ad.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/90 hover:bg-white shadow-sm"
                                        onClick={() => handleToggleActive(ad.id, ad.isActive)}
                                    >
                                        {ad.isActive ? (
                                            <ToggleRight className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">পজিশন: {ad.location}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <Link href={`/admin/ads/edit/${ad.id}`}>
                                            <Edit className="w-4 h-4 mr-1" />
                                            এডিট
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(ad.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        কোন বিজ্ঞাপন পাওয়া যায়নি
                    </div>
                )}
            </div>
        </div>
    );
}
