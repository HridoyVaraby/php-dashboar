'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, Search, Loader2 } from 'lucide-react';

interface EditorImageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImageSelect: (url: string) => void;
}

export const EditorImageDialog = ({ open, onOpenChange, onImageSelect }: EditorImageDialogProps) => {
    const [uploading, setUploading] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [galleryImages, setGalleryImages] = useState<{ name: string; url: string }[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    // Fetch gallery images when dialog opens
    useEffect(() => {
        if (open) {
            fetchGalleryImages();
        }
    }, [open]);

    const fetchGalleryImages = async () => {
        try {
            setLoadingGallery(true);
            const response = await fetch('/api/media');
            if (!response.ok) throw new Error('Failed to fetch images');
            const data = await response.json();
            setGalleryImages(data.images || []);
        } catch (error) {
            console.error(error);
            // Silent error or small toast
        } finally {
            setLoadingGallery(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            // Check file size (200KB limit)
            const maxSize = 200 * 1024; // 200KB matches featured image limit
            if (file.size > maxSize) {
                toast({
                    title: "ফাইল সাইজ বেশি",
                    description: "ইমেজ সাইজ ২০০ KB এর কম হতে হবে।",
                    variant: "destructive",
                });
                return;
            }

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
            onImageSelect(data.url);
            onOpenChange(false);
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
        onImageSelect(urlInput);
        onOpenChange(false);
        setUrlInput('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>ইমেজ নির্বাচন করুন</DialogTitle>
                    <DialogDescription>
                        নতুন ইমেজ আপলোড করুন অথবা গ্যালারি থেকে নির্বাচন করুন।
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-6 pt-2">
                    <Tabs defaultValue="upload" className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="upload">আপলোড / URL</TabsTrigger>
                            <TabsTrigger value="gallery">গ্যালারি</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="flex-1 mt-0">
                            <div className="h-full flex flex-col gap-6 justify-center items-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                                <div className="text-center">
                                    <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                                        <Upload className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">ইমেজ আপলোড করুন</h3>
                                    <p className="text-sm text-gray-500 mb-6">
                                        কম্পিউটার থেকে ড্রাগ ড্রপ করুন অথবা ক্লিক করুন
                                    </p>

                                    <Label htmlFor="editor-image-upload" className="cursor-pointer">
                                        <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            {uploading ? 'আপলোড হচ্ছে...' : 'ফাইল নির্বাচন করুন'}
                                        </div>
                                    </Label>
                                    <Input
                                        id="editor-image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </div>

                                <div className="w-full max-w-sm px-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-gray-50 px-2 text-gray-500">অথবা URL</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Input
                                            placeholder="https://example.com/image.jpg"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                                        />
                                        <Button type="button" onClick={handleUrlSubmit} variant="outline">
                                            যোগ করুন
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="gallery" className="flex-1 mt-0 h-full overflow-hidden flex flex-col">
                            <div className="mb-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="গ্যালারি খুঁজুন..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto border rounded-md p-4 min-h-[300px]">
                                {loadingGallery ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <p>গ্যালারি লোড হচ্ছে...</p>
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
                                                            className="group relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-200 transition-all"
                                                            onClick={() => {
                                                                onImageSelect(img.url);
                                                                onOpenChange(false);
                                                            }}
                                                        >
                                                            <img
                                                                src={img.url}
                                                                alt={img.name}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {img.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                                                <ImageIcon className="w-12 h-12 stroke-1" />
                                                <p>{galleryImages.length > 0 ? 'কোন ইমেজ পাওয়া যায়নি' : 'গ্যালারিতে কোন ইমেজ নেই'}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};
