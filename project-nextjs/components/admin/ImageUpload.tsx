'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    onImageUploaded: (url: string) => void;
    currentImage?: string;
    label?: string;
}

export const ImageUpload = ({ onImageUploaded, currentImage, label = "ইমেজ আপলোড" }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImage || '');
    const [urlInput, setUrlInput] = useState('');
    const [showGallery, setShowGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    // Update preview when currentImage prop changes
    useEffect(() => {
        if (currentImage) {
            setPreviewUrl(currentImage);
        }
    }, [currentImage]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            const file = event.target.files?.[0];
            if (!file) return;

            // Check file size (200KB limit)
            const maxSize = 200 * 1024; // 200KB
            if (file.size > maxSize) {
                toast({
                    title: "ফাইল সাইজ বেশি",
                    description: "ইমেজ সাইজ ২০০ KB এর কম হতে হবে।",
                    variant: "destructive",
                });
                return;
            }

            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "ভুল ফাইল টাইপ",
                    description: "শুধুমাত্র ইমেজ ফাইল আপলোড করুন।",
                    variant: "destructive",
                });
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setPreviewUrl(data.url);
            onImageUploaded(data.url);

            toast({
                title: "সফল!",
                description: "ইমেজ আপলোড হয়েছে।",
            });

        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "ইমেজ আপলোড করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (!urlInput.trim()) return;
        setPreviewUrl(urlInput);
        onImageUploaded(urlInput);
        setUrlInput('');
        toast({
            title: "সফল!",
            description: "ইমেজ URL যোগ হয়েছে।",
        });
    };

    const removeImage = () => {
        setPreviewUrl('');
        onImageUploaded('');
    };

    const fetchGalleryImages = async () => {
        try {
            setLoadingGallery(true);
            const response = await fetch('/api/media');
            if (!response.ok) throw new Error('Failed to fetch images');
            const data = await response.json();
            setGalleryImages(data.images);
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "গ্যালারি লোড করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        } finally {
            setLoadingGallery(false);
        }
    };

    const openGallery = () => {
        setShowGallery(true);
        fetchGalleryImages();
    };

    const selectFromGallery = (url: string) => {
        setPreviewUrl(url);
        onImageUploaded(url);
        setShowGallery(false);
        toast({
            title: "সফল!",
            description: "গ্যালারি থেকে ইমেজ নির্বাচন করা হয়েছে।",
        });
    };

    return (
        <div className="space-y-4">
            <Label>{label}</Label>

            {previewUrl ? (
                <div className="space-y-3">
                    <div className="relative group">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border bg-gray-50"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Image+Not+Found';
                            }}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeImage}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Label htmlFor="image-upload-replace" className="cursor-pointer flex-1">
                            <div className="flex items-center justify-center space-x-2 h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium shadow-sm transition-colors">
                                <Upload className="w-4 h-4" />
                                <span>পরিবর্তন করুন</span>
                            </div>
                        </Label>
                        <Input
                            id="image-upload-replace"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                        />

                        <Button type="button" variant="outline" onClick={openGallery} className="flex-1">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            গ্যালারি
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex flex-col gap-3 items-center">
                            <div className="flex gap-2 w-full justify-center">
                                <Label htmlFor="image-upload" className="cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2 h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium shadow transition-colors">
                                        <Upload className="w-4 h-4" />
                                        <span>আপলোড করুন</span>
                                    </div>
                                </Label>
                                <Button type="button" variant="outline" onClick={openGallery}>
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    গ্যালারি
                                </Button>
                            </div>
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            সর্বোচ্চ সাইজ: ২০০ KB (JPG, PNG, WEBP)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-gray-500 text-center uppercase tracking-wider font-semibold">অথবা URL ব্যবহার করুন</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                            />
                            <Button type="button" onClick={handleUrlSubmit} size="sm" variant="secondary">
                                যোগ করুন
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {uploading && (
                <p className="text-sm text-center text-blue-600 animate-pulse">আপলোড হচ্ছে...</p>
            )}

            {/* Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">মিডিয়া গ্যালারি</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowGallery(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="p-4 border-b bg-gray-50">
                            <Input
                                placeholder="ইমেজ খুঁজুন..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-md w-full"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {loadingGallery ? (
                                <div className="flex justify-center items-center h-40">
                                    <p className="text-gray-500">লোড হচ্ছে...</p>
                                </div>
                            ) : (
                                <>
                                    {galleryImages.filter(img => img.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                            {galleryImages
                                                .filter(img => img.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="group relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                                        onClick={() => selectFromGallery(img.url)}
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={img.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {img.name.split('-').slice(1).join('-') || img.name}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            {galleryImages.length > 0 ? 'কোন ইমেজ পাওয়া যায়নি' : 'গ্যালারিতে কোন ইমেজ নেই'}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
