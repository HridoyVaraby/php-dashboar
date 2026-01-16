'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

export default function AdminNewsletterPage() {
    const { data: subscribers, isLoading } = useQuery({
        queryKey: ['newsletter-subscribers'],
        queryFn: async () => {
            const response = await fetch('/api/newsletter');
            if (!response.ok) throw new Error('Failed to fetch subscribers');
            return response.json();
        },
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleExport = () => {
        if (!subscribers || subscribers.length === 0) {
            alert('No subscribers to export');
            return;
        }

        // Define CSV headers
        const headers = ['Email', 'Subscribed Date'];

        // Convert data to CSV format
        const csvContent = [
            headers.join(','),
            ...subscribers.map((sub: any) => {
                const date = new Date(sub.createdAt).toLocaleDateString('en-US');
                return `${sub.email},${date}`;
            })
        ].join('\n');

        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">নিউজলেটার সাবস্ক্রাইবার</h1>
                    <p className="text-gray-600 mt-1">সকল সাবস্ক্রাইবার দেখুন এবং পরিচালনা করুন</p>
                </div>
                <Button onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV এক্সপোর্ট
                </Button>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ইমেইল
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    সাবস্ক্রাইব তারিখ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    অ্যাকশন
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                        লোড হচ্ছে...
                                    </td>
                                </tr>
                            ) : subscribers && subscribers.length > 0 ? (
                                subscribers.map((subscriber: any) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{subscriber.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(subscriber.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                        কোন সাবস্ক্রাইবার পাওয়া যায়নি
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
