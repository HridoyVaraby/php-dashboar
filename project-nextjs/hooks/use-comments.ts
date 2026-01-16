import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function useComments(postId?: string) {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            const url = postId ? `/api/comments?postId=${postId}` : '/api/comments';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            return response.json();
        },
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ content, postId, parentId }: { content: string; postId: string; parentId?: string }) => {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, postId, parentId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create comment');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
            toast({
                title: "মতামত জমা দেওয়া হয়েছে",
                description: "আপনার মতামত অনুমোদনের জন্য অপেক্ষা করছে।",
            });
        },
        onError: (error) => {
            toast({
                title: "ত্রুটি",
                description: "মতামত জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
                variant: "destructive",
            });
        },
    });
}
