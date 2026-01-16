'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Send, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toLocalDateTimeString } from '@/lib/datetime-utils';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { toast } = useToast();
    const [postId, setPostId] = useState<string>('');

    useEffect(() => {
        params.then(p => setPostId(p.id));
    }, [params]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        status: 'DRAFT',
        isFeatured: false,
        subtitle: '',
        featuredPosition: 'none',
        publishedAt: '',
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [newTagName, setNewTagName] = useState('');

    const handleContentChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            content,
        }));
    };

    // Fetch Post Data
    const { data: post, isLoading: isPostLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            if (!postId) return null;
            const response = await fetch(`/api/posts/${postId}`);
            if (!response.ok) throw new Error('Failed to fetch post');
            return response.json();
        },
        enabled: !!postId,
    });

    // Populate Form
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                content: post.content || '',
                excerpt: post.excerpt || '',
                featuredImage: post.featuredImage || '',
                status: post.status || 'DRAFT',
                isFeatured: post.isFeatured || false,
                subtitle: post.subtitle || '',
                featuredPosition: post.featuredPosition ? String(post.featuredPosition) : 'none',
                publishedAt: toLocalDateTimeString(post.publishedAt),
            });

            if (post.categories && post.categories.length > 0) {
                setSelectedCategories(post.categories.map((c: any) => c.id));
            } else if (post.categoryId) {
                setSelectedCategories([post.categoryId]);
            }

            if (post.subcategoryId) setSelectedSubcategories([post.subcategoryId]);
            if (post.postTags) setSelectedTags(post.postTags.map((pt: any) => pt.tagId));
        }
    }, [post]);

    // Fetch Options
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        },
    });

    const { data: subcategories } = useQuery({
        queryKey: ['subcategories'],
        queryFn: async () => {
            const response = await fetch('/api/subcategories');
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        },
    });

    const { data: tags } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await fetch('/api/tags');
            if (!response.ok) throw new Error('Failed to fetch');
            return response.json();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update post');
            }
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: 'সফল!',
                description: 'পোস্ট আপডেট হয়েছে।',
            });
            router.push('/admin/posts');
        },
        onError: (error: Error) => {
            toast({
                title: 'ত্রুটি',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const handleSubmit = (status: 'DRAFT' | 'PUBLISHED') => {
        if (!formData.title || !formData.content || selectedCategories.length === 0) {
            toast({
                title: 'ত্রুটি',
                description: 'শিরোনাম, কন্টেন্ট এবং ক্যাটেগরি আবশ্যক।',
                variant: 'destructive',
            });
            return;
        }

        updateMutation.mutate({
            ...formData,
            status,
            categoryIds: selectedCategories,
            subcategoryIds: selectedSubcategories,
            tagIds: selectedTags,
            featuredPosition: formData.featuredPosition === 'none' ? null : parseInt(formData.featuredPosition),
            publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null,
        });
    };

    const createNewTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const slug = newTagName.toLowerCase().replace(/\s+/g, '-');
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTagName, slug }),
            });

            if (!response.ok) throw new Error('Failed to create tag');

            const newTag = await response.json();
            setSelectedTags([...selectedTags, newTag.id]);
            setNewTagName('');
            toast({
                title: 'সফল!',
                description: 'নতুন ট্যাগ তৈরি হয়েছে।',
            });
        } catch (error) {
            toast({
                title: 'ত্রুটি',
                description: 'ট্যাগ তৈরি করতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        }
    };

    if (isPostLoading) {
        return <div className="p-6 text-center">লোড হচ্ছে...</div>;
    }

    return (
        <Card className="max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/posts">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                ফিরে যান
                            </Link>
                        </Button>
                        <span>পোস্ট সম্পাদনা</span>
                    </div>

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
                                placeholder="পোস্টের শিরোনাম লিখুন"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="subtitle">উপশিরোনাম (অপশনাল)</Label>
                            <Input
                                id="subtitle"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                placeholder="পোস্টের উপশিরোনাম"
                            />
                        </div>

                        <div>
                            <Label htmlFor="excerpt">সংক্ষিপ্ত বিবরণ</Label>
                            <Input
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="পোস্টের সংক্ষিপ্ত বিবরণ"
                            />
                        </div>

                        <RichTextEditor
                            value={formData.content}
                            onChange={handleContentChange}
                        />
                    </div>

                    {/* Right Column - Options */}
                    <div className="space-y-6">
                        <ImageUpload
                            currentImage={formData.featuredImage}
                            onImageUploaded={(url) => setFormData({ ...formData, featuredImage: url })}
                            label="ফিচারড ইমেজ"
                        />

                        {/* Categories */}
                        <div>
                            <Label>ক্যাটেগরি নির্বাচন করুন *</Label>
                            <div className="max-h-32 overflow-y-auto space-y-2 mt-2 border rounded-lg p-3">
                                {categories?.map((category: any) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`cat-${category.id}`}
                                            checked={selectedCategories.includes(category.id)}
                                            onCheckedChange={() => {
                                                setSelectedCategories(prev =>
                                                    prev.includes(category.id)
                                                        ? prev.filter(id => id !== category.id)
                                                        : [...prev, category.id]
                                                );
                                            }}
                                        />
                                        <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                                            {category.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedCategories.map(categoryId => {
                                    const category = categories?.find((c: any) => c.id === categoryId);
                                    return category ? (
                                        <Badge key={categoryId} variant="secondary">
                                            {category.name}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedCategories(prev => prev.filter(id => id !== categoryId))}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        </div>

                        {/* Subcategories */}
                        {subcategories && subcategories.length > 0 && (
                            <div>
                                <Label>সাবক্যাটেগরি</Label>
                                <div className="max-h-32 overflow-y-auto space-y-2 mt-2 border rounded-lg p-3">
                                    {subcategories.map((subcategory: any) => (
                                        <div key={subcategory.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`sub-${subcategory.id}`}
                                                checked={selectedSubcategories.includes(subcategory.id)}
                                                onCheckedChange={() => {
                                                    setSelectedSubcategories(prev =>
                                                        prev.includes(subcategory.id)
                                                            ? prev.filter(id => id !== subcategory.id)
                                                            : [...prev, subcategory.id]
                                                    );
                                                }}
                                            />
                                            <Label htmlFor={`sub-${subcategory.id}`} className="text-sm cursor-pointer">
                                                {subcategory.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {selectedSubcategories.map(subId => {
                                        const sub = subcategories?.find((s: any) => s.id === subId);
                                        return sub ? (
                                            <Badge key={subId} variant="outline">
                                                {sub.name}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSubcategories(prev => prev.filter(id => id !== subId))}
                                                    className="ml-1 hover:text-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        <div>
                            <Label>ট্যাগ</Label>
                            <div className="flex space-x-2 mb-3">
                                <Input
                                    placeholder="নতুন ট্যাগ"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), createNewTag())}
                                />
                                <Button type="button" variant="outline" size="sm" onClick={createNewTag}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="max-h-32 overflow-y-auto space-y-2 border rounded-lg p-3">
                                {tags?.map((tag: any) => (
                                    <div key={tag.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={tag.id}
                                            checked={selectedTags.includes(tag.id)}
                                            onCheckedChange={() => {
                                                setSelectedTags(prev =>
                                                    prev.includes(tag.id)
                                                        ? prev.filter(id => id !== tag.id)
                                                        : [...prev, tag.id]
                                                );
                                            }}
                                        />
                                        <Label htmlFor={tag.id} className="text-sm cursor-pointer">
                                            {tag.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedTags.map(tagId => {
                                    const tag = tags?.find((t: any) => t.id === tagId);
                                    return tag ? (
                                        <Badge key={tagId}>
                                            {tag.name}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedTags(prev => prev.filter(id => id !== tagId))}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        </div>

                        {/* Reading Time */}


                        {/* Featured Toggle */}
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
                                    <SelectItem value="1">ফিচারড পোস্ট ১ (বড়)</SelectItem>
                                    <SelectItem value="2">ফিচারড পোস্ট ২ (ছোট)</SelectItem>
                                    <SelectItem value="3">ফিচারড পোস্ট ৩ (ছোট)</SelectItem>
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

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="featured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: Boolean(checked) })}
                            />
                            <Label htmlFor="featured">ফিচারড লিস্টে দেখান</Label>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSubmit('DRAFT')}
                    disabled={updateMutation.isPending}
                >
                    <Save className="w-4 h-4 mr-2" />
                    ড্রাফট সেভ
                </Button>
                <Button
                    type="button"
                    onClick={() => handleSubmit('PUBLISHED')}
                    disabled={updateMutation.isPending}
                >
                    <Send className="w-4 h-4 mr-2" />
                    আপডেট করুন
                </Button>
            </CardFooter>
        </Card>
    );
}
