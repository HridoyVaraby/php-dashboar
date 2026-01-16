'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    parentCategoryId: string;
    createdAt: string;
    category?: {
        name: string;
    };
}

interface Category {
    id: string;
    name: string;
}

interface FormData {
    name: string;
    slug: string;
    parentCategoryId: string;
}

const SubcategoriesManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
    const [formData, setFormData] = useState<FormData>({ name: '', slug: '', parentCategoryId: '' });
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            return response.json();
        },
    });

    const { data: subcategories, isLoading } = useQuery<Subcategory[]>({
        queryKey: ['admin-subcategories'],
        queryFn: async () => {
            const response = await fetch('/api/subcategories');
            if (!response.ok) throw new Error('Failed to fetch subcategories');
            return response.json();
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const url = editingSubcategory
                ? `/api/subcategories/${editingSubcategory.id}`
                : '/api/subcategories';
            const method = editingSubcategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to save subcategory');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
            toast({
                title: 'সফল!',
                description: editingSubcategory ? 'সাবক্যাটেগরি আপডেট হয়েছে।' : 'নতুন সাবক্যাটেগরি তৈরি হয়েছে।',
            });
            resetForm();
        },
        onError: () => {
            toast({
                title: 'ত্রুটি',
                description: 'সাবক্যাটেগরি সেভ করতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (subcategoryId: string) => {
            const response = await fetch(`/api/subcategories/${subcategoryId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete subcategory');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subcategories'] });
            toast({
                title: 'সফল!',
                description: 'সাবক্যাটেগরি ডিলিট হয়েছে।',
            });
        },
        onError: () => {
            toast({
                title: 'ত্রুটি',
                description: 'সাবক্যাটেগরি ডিলিট করতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        },
    });

    const resetForm = () => {
        setFormData({ name: '', slug: '', parentCategoryId: '' });
        setEditingSubcategory(null);
        setShowForm(false);
    };

    const handleEdit = (subcategory: Subcategory) => {
        setFormData({
            name: subcategory.name,
            slug: subcategory.slug,
            parentCategoryId: subcategory.parentCategoryId
        });
        setEditingSubcategory(subcategory);
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.slug || !formData.parentCategoryId) {
            toast({
                title: 'ত্রুটি',
                description: 'সকল ফিল্ড পূরণ করুন।',
                variant: 'destructive',
            });
            return;
        }
        saveMutation.mutate(formData);
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
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    নতুন সাবক্যাটেগরি
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingSubcategory ? 'সাবক্যাটেগরি সম্পাদনা' : 'নতুন সাবক্যাটেগরি'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="parent_category">প্যারেন্ট ক্যাটেগরি</Label>
                                <Select
                                    value={formData.parentCategoryId}
                                    onValueChange={(value) => setFormData({ ...formData, parentCategoryId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="name">নাম</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name,
                                            slug: generateSlug(name)
                                        });
                                    }}
                                    placeholder="সাবক্যাটেগরির নাম"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="slug">স্লাগ</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="subcategory-slug"
                                    required
                                />
                            </div>
                            <div className="flex space-x-4">
                                <Button type="submit" disabled={saveMutation.isPending}>
                                    {saveMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    বাতিল
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>সকল সাবক্যাটেগরি</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-4">লোড হচ্ছে...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>নাম</TableHead>
                                    <TableHead>প্যারেন্ট ক্যাটেগরি</TableHead>
                                    <TableHead>স্লাগ</TableHead>
                                    <TableHead>তৈরির তারিখ</TableHead>
                                    <TableHead>অ্যাকশন</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subcategories?.map((subcategory) => (
                                    <TableRow key={subcategory.id}>
                                        <TableCell className="font-medium">{subcategory.name}</TableCell>
                                        <TableCell>{subcategory.category?.name}</TableCell>
                                        <TableCell>{subcategory.slug}</TableCell>
                                        <TableCell>
                                            {new Date(subcategory.createdAt).toLocaleDateString('bn-BD')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(subcategory)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteMutation.mutate(subcategory.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SubcategoriesManagement;
