'use client';

import { useComments } from '@/hooks/use-comments';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminCommentsPage() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

    // For now, we'll get all comments - in production you'd filter by postId or get all
    const { data: comments, isLoading } = useComments('');

    const filteredComments = comments?.filter((comment: any) => {
        if (filter === 'pending') return !comment.isApproved;
        if (filter === 'approved') return comment.isApproved;
        return true;
    });

    const queryClient = useQueryClient();
    const { toast } = useToast();

    const handleApprove = async (commentId: string) => {
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: true }),
            });

            if (!res.ok) throw new Error('Failed to approve comment');

            queryClient.invalidateQueries({ queryKey: ['comments'] });
            toast({
                title: "সফল!",
                description: "মন্তব্যটি অনুমোদিত হয়েছে।",
            });
        } catch (error) {
            console.error('Error approving comment:', error);
            toast({
                title: "ত্রুটি",
                description: "মন্তব্য অনুমোদন করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (commentId: string) => {
        if (!confirm('আপনি কি নিশ্চিত যে আপনি এই মন্তব্যটি মুছে ফেলতে চান?')) return;

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete comment');

            queryClient.invalidateQueries({ queryKey: ['comments'] });
            toast({
                title: "সফল!",
                description: "মন্তব্যটি মুছে ফেলা হয়েছে।",
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast({
                title: "ত্রুটি",
                description: "মন্তব্য মুছতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">মন্তব্য মডারেশন</h1>
                <p className="text-gray-600 mt-1">পেন্ডিং মন্তব্য পর্যালোচনা করুন</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilter('pending')}
                    >
                        পেন্ডিং
                    </Button>
                    <Button
                        variant={filter === 'approved' ? 'default' : 'outline'}
                        onClick={() => setFilter('approved')}
                    >
                        অনুমোদিত
                    </Button>
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                    >
                        সকল
                    </Button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-gray-500">
                        লোড হচ্ছে...
                    </div>
                ) : filteredComments && filteredComments.length > 0 ? (
                    filteredComments.map((comment: any) => (
                        <div key={comment.id} className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-semibold text-gray-900">{comment.user?.fullName}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString('bn-BD')}
                                    </p>
                                </div>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${comment.isApproved
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {comment.isApproved ? 'অনুমোদিত' : 'পেন্ডিং'}
                                </span>
                            </div>

                            <p className="text-gray-700 mb-4">{comment.content}</p>

                            <div className="flex gap-2">
                                {!comment.isApproved && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleApprove(comment.id)}
                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                    >
                                        <Check className="w-4 h-4 mr-1" />
                                        অনুমোদন করুন
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleReject(comment.id)}
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    মুছে ফেলুন
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-gray-500">
                        কোন মন্তব্য পাওয়া যায়নি
                    </div>
                )}
            </div>
        </div>
    );
}
