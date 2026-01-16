import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useSearch = () => {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const performSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsLoading(true);
        setIsSearching(true);

        try {
            const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setIsSearching(false);
    };

    return {
        searchResults,
        isLoading,
        isSearching,
        performSearch,
        clearSearch
    };
};
