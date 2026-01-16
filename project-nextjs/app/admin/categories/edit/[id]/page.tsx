'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    const [categoryId, setCategoryId] = useState<string>('');

    useEffect(() => {
        params.then(p => setCategoryId(p.id));
    }, [params]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
    });

    const { data: category, isLoading } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: async () => {
            if (!categoryId) return null;
            const response = await fetch(`/api/categories/${categoryId}`);
            if (!response.ok) throw new Error('Failed to fetch category');
            const data = await response.json();
            return data.category; // Extract category from nested response
        },
        enabled: !!categoryId,
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
            });
        }
    }, [category]);

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update category');
            }
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: 'সফল!',
                description: 'ক্যাটেগরি আপডেট হয়েছে।',
            });
            router.push('/admin/categories');
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
        if (!formData.name || !formData.slug) {
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
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/categories">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                ফিরে যান
                            </Link>
                        </Button>
                        <span>ক্যাটেগরি সম্পাদনা</span>
                    </div>
                    <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        আপডেট করুন
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">নাম *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="ক্যাটেগরির নাম"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="slug">স্লাগ *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            placeholder="category-slug"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            ইংরেজি ছোট হাতের অক্ষর এবং হাইফেন ব্যবহার করুন
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
