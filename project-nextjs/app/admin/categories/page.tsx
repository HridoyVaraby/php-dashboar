'use client';

import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function AdminCategoriesPage() {
    const { data: categories, isLoading } = useCategories();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm('আপনি কি নিশ্চিত যে আপনি এই ক্যাটেগরি মুছে ফেলতে চান?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete category');

            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({
                title: "সফল!",
                description: "ক্যাটেগরি মুছে ফেলা হয়েছে।",
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            toast({
                title: "ত্রুটি",
                description: "ক্যাটেগরি মুছতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ক্যাটেগরি ম্যানেজমেন্ট</h1>
                    <p className="text-gray-600 mt-1">সকল ক্যাটেগরি এবং সাবক্যাটেগরি পরিচালনা করুন</p>
                </div>
                <Button asChild>
                    <Link href="/admin/categories/create">
                        <Plus className="w-4 h-4 mr-2" />
                        নতুন ক্যাটেগরি
                    </Link>
                </Button>
            </div>

            {/* Categories List */}
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
                                    সাবক্যাটেগরি
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
                            ) : categories && categories.length > 0 ? (
                                categories.map((category: any) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {category.slug}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {category.subcategories?.length || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/categories/edit/${category.id}`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(category.id)}
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
                                        কোন ক্যাটেগরি পাওয়া যায়নি
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
