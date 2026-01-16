import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { X } from 'lucide-react';

interface SearchResultsProps {
    results: any[];
    isLoading: boolean;
    onClose: () => void;
    query: string;
}

const SearchResults = ({ results, isLoading, onClose, query }: SearchResultsProps) => {
    if (!query.trim()) return null;

    return (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-1">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <h3 className="font-medium">খোঁজার ফলাফল</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                    খুঁজছি...
                </div>
            ) : results.length > 0 ? (
                <div className="divide-y divide-gray-100">
                    {results.map((post) => (
                        <Link
                            key={post.id}
                            href={`/post/${post.id}`}
                            onClick={onClose}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex gap-3">
                                {post.featuredImage && (
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 line-clamp-2 mb-1">
                                        {post.title}
                                    </h4>
                                    {post.excerpt && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        {post.category && (
                                            <span className="bg-gray-100 px-2 py-1 rounded">
                                                {post.category.name}
                                            </span>
                                        )}
                                        <span>
                                            {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                                                addSuffix: true,
                                                locale: bn
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-gray-500">
                    কোনো ফলাফল পাওয়া যায়নি
                </div>
            )}
        </div>
    );
};

export default SearchResults;
