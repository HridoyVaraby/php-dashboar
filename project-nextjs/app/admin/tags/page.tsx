'use client';

import { useTags } from '@/hooks/use-tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function AdminTagsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const { data: tags, isLoading } = useTags({ search: searchTerm });
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create tag');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast({
                title: 'সফল!',
                description: 'ট্যাগ তৈরি হয়েছে।',
            });
            setShowForm(false);
            setFormData({ name: '', slug: '' });
        },
        onError: () => {
            toast({
                title: 'ত্রুটি',
                description: 'ট্যাগ তৈরি করতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/tags/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete tag');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast({
                title: 'সফল!',
                description: 'ট্যাগ ডিলিট হয়েছে।',
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.slug) {
            toast({
                title: 'ত্রুটি',
                description: 'নাম এবং স্লাগ আবশ্যক।',
                variant: 'destructive',
            });
            return;
        }
        createMutation.mutate(formData);
    };

    const handleDelete = (id: string) => {
        if (confirm('আপনি কি নিশ্চিত যে আপনি এই ট্যাগটি ডিলিট করতে চান?')) {
            deleteMutation.mutate(id);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ট্যাগ ম্যানেজমেন্ট</h1>
                    <p className="text-gray-600 mt-1">সকল ট্যাগ দেখুন এবং পরিচালনা করুন</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {showForm ? 'বাতিল করুন' : 'নতুন ট্যাগ'}
                </Button>
            </div>

            {/* Create Tag Form */}
            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>নতুন ট্যাগ তৈরি করুন</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="name">নাম</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData({
                                            name,
                                            slug: generateSlug(name)
                                        });
                                    }}
                                    placeholder="ট্যাগের নাম"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="slug">স্লাগ</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="tag-slug"
                                />
                            </div>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="ট্যাগ খুঁজুন..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Tags Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    নাম
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    স্লাগ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    পোস্ট সংখ্যা
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    অ্যাকশন
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        লোড হচ্ছে...
                                    </td>
                                </tr>
                            ) : tags && tags.length > 0 ? (
                                tags.map((tag: any) => (
                                    <tr key={tag.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{tag.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {tag.slug}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {tag._count?.postTags || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(tag.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        কোন ট্যাগ পাওয়া যায়নি
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
