'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Settings } from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    const [adId, setAdId] = useState<string>('');

    useEffect(() => {
        params.then(p => setAdId(p.id));
    }, [params]);

    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        linkUrl: '',
        location: '',
        isActive: true,
    });

    const { data: ad, isLoading } = useQuery({
        queryKey: ['ad', adId],
        queryFn: async () => {
            if (!adId) return null;
            const response = await fetch(`/api/ads/${adId}`);
            if (!response.ok) throw new Error('Failed to fetch ad');
            return response.json();
        },
        enabled: !!adId,
    });

    useEffect(() => {
        if (ad) {
            setFormData({
                title: ad.title || '',
                imageUrl: ad.imageUrl || '',
                linkUrl: ad.linkUrl || '',
                location: ad.location || '',
                isActive: ad.isActive ?? true,
            });
        }
    }, [ad]);

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`/api/ads/${adId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update ad');
            }
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: 'সফল!',
                description: 'বিজ্ঞাপন আপডেট হয়েছে।',
            });
            router.push('/admin/ads');
        },
        onError: (error: Error) => {
            toast({
                title: 'ত্রুটি',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl || !formData.linkUrl || !formData.location) {
            toast({
                title: 'ত্রুটি',
                description: 'সকল প্রয়োজনীয় ফিল্ড পূরণ করুন।',
                variant: 'destructive',
            });
            return;
        }

        updateMutation.mutate(formData);
    };

    if (isLoading) return <div className="p-6 text-center">লোড হচ্ছে...</div>;

    return (
        <Card className="max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/ads">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                ফিরে যান
                            </Link>
                        </Button>
                        <span>বিজ্ঞাপন সম্পাদনা</span>
                    </div>
                    <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        আপডেট করুন
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <Label htmlFor="title">শিরোনাম *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="বিজ্ঞাপনের শিরোনাম"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="linkUrl">লিংক URL *</Label>
                            <Input
                                id="linkUrl"
                                value={formData.linkUrl}
                                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                placeholder="ক্লিক করলে যেতে হবে এমন URL"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="location">অবস্থান *</Label>
                            <Select
                                value={formData.location}
                                onValueChange={(value) => setFormData({ ...formData, location: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="বিজ্ঞাপনের অবস্থান নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="homepage">হোমপেজ</SelectItem>
                                    <SelectItem value="sidebar">সাইডবার</SelectItem>
                                    <SelectItem value="post_middle">পোস্ট মিডল</SelectItem>
                                    <SelectItem value="post_bottom">পোস্ট বটম</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Right Column - Image & Status */}
                    <div className="space-y-6">
                        <ImageUpload
                            currentImage={formData.imageUrl}
                            onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                            label="বিজ্ঞাপনের ইমেজ *"
                        />

                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-medium flex items-center gap-2 mb-3">
                                <Settings className="w-4 h-4" />
                                সেটিংস
                            </h3>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: Boolean(checked) })}
                                />
                                <Label htmlFor="isActive">সক্রিয় বিজ্ঞাপন</Label>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
