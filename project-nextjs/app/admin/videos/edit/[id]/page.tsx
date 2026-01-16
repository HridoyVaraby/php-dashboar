'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Video as VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toLocalDateTimeString } from '@/lib/datetime-utils';

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    const [videoId, setVideoId] = useState<string>('');

    useEffect(() => {
        params.then(p => setVideoId(p.id));
    }, [params]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        thumbnail: '',
        featuredPosition: 'none',
        publishedAt: '',
    });

    // Auto-generate thumbnail from YouTube URL
    useEffect(() => {
        if (formData.videoUrl && !formData.thumbnail) {
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = formData.videoUrl.match(regex);
            if (match) {
                setFormData(prev => ({
                    ...prev,
                    thumbnail: `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
                }));
            }
        }
    }, [formData.videoUrl, formData.thumbnail]);

    const { data: video, isLoading } = useQuery({
        queryKey: ['video', videoId],
        queryFn: async () => {
            if (!videoId) return null;
            const response = await fetch(`/api/videos/${videoId}`);
            if (!response.ok) throw new Error('Failed to fetch video');
            return response.json();
        },
        enabled: !!videoId,
    });

    useEffect(() => {
        if (video) {
            setFormData({
                title: video.title || '',
                description: video.description || '',
                videoUrl: video.videoUrl || '',
                thumbnail: video.thumbnail || '',
                featuredPosition: video.featuredPosition ? String(video.featuredPosition) : 'none',
                publishedAt: toLocalDateTimeString(video.publishedAt),
            });
        }
    }, [video]);

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`/api/videos/${videoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update video');
            }
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: 'সফল!',
                description: 'ভিডিও আপডেট হয়েছে।',
            });
            router.push('/admin/videos');
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
        if (!formData.title || !formData.videoUrl) {
            toast({
                title: 'ত্রুটি',
                description: 'শিরোনাম এবং ভিডিও URL আবশ্যক।',
                variant: 'destructive',
            });
            return;
        }

        updateMutation.mutate({
            ...formData,
            featuredPosition: formData.featuredPosition === 'none' ? null : parseInt(formData.featuredPosition),
            publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        });
    };

    if (isLoading) return <div className="p-6 text-center">লোড হচ্ছে...</div>;

    return (
        <Card className="max-w-5xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/videos">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                ফিরে যান
                            </Link>
                        </Button>
                        <span>ভিডিও সম্পাদনা</span>
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
                                placeholder="ভিডিওর শিরোনাম"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">বিবরণ</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="ভিডিওর বিবরণ"
                                rows={5}
                            />
                        </div>
                    </div>

                    {/* Right Column - Video Details */}
                    <div className="space-y-6">
                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-medium flex items-center gap-2">
                                <VideoIcon className="w-4 h-4" />
                                ভিডিও তথ্য
                            </h3>

                            <div>
                                <Label htmlFor="videoUrl">ভিডিও URL *</Label>
                                <Input
                                    id="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                    placeholder="YouTube URL"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="thumbnail">থাম্বনেইল URL</Label>
                                <Input
                                    id="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    placeholder="অটোমেটিক জেনারেট হবে"
                                />
                            </div>

                            {formData.thumbnail && (
                                <div className="mt-2">
                                    <Label>প্রিভিউ:</Label>
                                    <img
                                        src={formData.thumbnail}
                                        alt="Thumbnail Preview"
                                        className="w-full h-auto rounded-lg border mt-1"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Featured Position */}
                        <div>
                            <Label>ফিচারড পজিশন</Label>
                            <Select
                                value={formData.featuredPosition}
                                onValueChange={(value) => setFormData({ ...formData, featuredPosition: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="পজিশন নির্বাচন করুন" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">কোনটিই না</SelectItem>
                                    <SelectItem value="1">ফিচারড ভিডিও ১</SelectItem>
                                    <SelectItem value="2">ফিচারড ভিডিও ২</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Publish Date */}
                        <div>
                            <Label htmlFor="publishedAt">প্রকাশের সময়</Label>
                            <Input
                                id="publishedAt"
                                type="datetime-local"
                                value={formData.publishedAt}
                                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
