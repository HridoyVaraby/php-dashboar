'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { getCurrentLocalDateTime } from '@/lib/datetime-utils';

export default function CreateOpinionPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        authorName: '',
        authorRole: '',
        authorImage: '',
        publishedAt: getCurrentLocalDateTime(),
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch('/api/opinions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create opinion');
            }
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: 'সফল!',
                description: 'মতামত তৈরি হয়েছে।',
            });
            router.push('/admin/opinions');
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
        if (!formData.title || !formData.content || !formData.authorName) {
            toast({
                title: 'ত্রুটি',
                description: 'শিরোনাম, কন্টেন্ট এবং লেখকের নাম আবশ্যক।',
                variant: 'destructive',
            });
            return;
        }

        createMutation.mutate({
            ...formData,
            publishedAt: new Date(formData.publishedAt).toISOString(),
        });
    };

    return (
        <Card className="max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/opinions">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                ফিরে যান
                            </Link>
                        </Button>
                        <span>নতুন মতামত</span>
                    </div>
                    <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        সেভ করুন
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <Label htmlFor="title">শিরোনাম *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="মতামতের শিরোনাম"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="excerpt">সংক্ষিপ্ত বিবরণ</Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="মতামতের সংক্ষিপ্ত বিবরণ"
                                rows={3}
                            />
                        </div>

                        <RichTextEditor
                            value={formData.content}
                            onChange={(value) => setFormData({ ...formData, content: value })}
                            label="বিস্তারিত কন্টেন্ট"
                        />
                    </div>

                    {/* Right Column - Author Info */}
                    <div className="space-y-6">
                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-medium flex items-center gap-2">
                                <User className="w-4 h-4" />
                                লেখকের তথ্য
                            </h3>

                            <div>
                                <Label htmlFor="authorName">লেখকের নাম *</Label>
                                <Input
                                    id="authorName"
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                    placeholder="লেখকের নাম"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="authorRole">লেখকের পদবী</Label>
                                <Input
                                    id="authorRole"
                                    value={formData.authorRole}
                                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                                    placeholder="যেমন: অর্থনীতিবিদ"
                                />
                            </div>

                            <ImageUpload
                                currentImage={formData.authorImage}
                                onImageUploaded={(url) => setFormData({ ...formData, authorImage: url })}
                                label="লেখকের ছবি"
                            />

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
                </div>
            </CardContent>
        </Card>
    );
}
