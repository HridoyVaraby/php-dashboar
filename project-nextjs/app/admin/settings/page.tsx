'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Globe, Mail, Shield, Database } from 'lucide-react';

interface SiteSettings {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    logoUrl: string;
    faviconUrl: string;
    contactEmail: string;
    socialFacebook: string;
    socialTwitter: string;
    socialYoutube: string;
    enableComments: boolean;
    enableNewsletter: boolean;
    maintenanceMode: boolean;
    postsPerPage: number;
    enableAds: boolean;
}

export default function SettingsPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('general');

    const { data: settings, isLoading } = useQuery<SiteSettings>({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error('Failed to fetch settings');
            return response.json();
        },
    });

    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: async () => {
            const response = await fetch('/api/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
        },
    });

    const [localSettings, setLocalSettings] = useState<SiteSettings | undefined>(settings);

    // Update local settings when query data changes
    useState(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: SiteSettings) => {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update settings');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            toast({
                title: 'সফল',
                description: 'সেটিংস সংরক্ষিত হয়েছে।',
            });
        },
        onError: () => {
            toast({
                title: 'ত্রুটি',
                description: 'সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।',
                variant: 'destructive',
            });
        },
    });

    const handleInputChange = (field: keyof SiteSettings, value: string | boolean | number) => {
        setLocalSettings(prev => prev ? ({ ...prev, [field]: value }) : undefined);
    };

    const handleSave = () => {
        if (localSettings) {
            updateMutation.mutate(localSettings);
        }
    };

    if (isLoading || !localSettings) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">সেটিংস</h1>
                <p className="text-gray-600">সাইটের সেটিংস পরিচালনা করুন</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        সাধারণ
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        কন্টেন্ট
                    </TabsTrigger>
                    <TabsTrigger value="social" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        সোশ্যাল
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        নিরাপত্তা
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>সাইটের তথ্য</CardTitle>
                                <CardDescription>আপনার সাইটের মূল তথ্য পরিবর্তন করুন</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="siteName">সাইটের নাম</Label>
                                        <Input
                                            id="siteName"
                                            value={localSettings.siteName}
                                            onChange={(e) => handleInputChange('siteName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="siteUrl">সাইটের URL</Label>
                                        <Input
                                            id="siteUrl"
                                            value={localSettings.siteUrl}
                                            onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="siteDescription">সাইটের বিবরণ</Label>
                                    <Textarea
                                        id="siteDescription"
                                        value={localSettings.siteDescription}
                                        onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logoUrl">লোগো URL</Label>
                                        <Input
                                            id="logoUrl"
                                            value={localSettings.logoUrl}
                                            onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                                            placeholder="https://example.com/logo.png"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactEmail">যোগাযোগের ইমেইল</Label>
                                        <Input
                                            id="contactEmail"
                                            type="email"
                                            value={localSettings.contactEmail}
                                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>সাইটের পরিসংখ্যান</CardTitle>
                                <CardDescription>আপনার সাইটের বর্তমান অবস্থা</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{stats?.posts || 0}</div>
                                        <div className="text-sm text-gray-600">পোস্ট</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{stats?.users || 0}</div>
                                        <div className="text-sm text-gray-600">ইউজার</div>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">{stats?.comments || 0}</div>
                                        <div className="text-sm text-gray-600">মন্তব্য</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">{stats?.categories || 0}</div>
                                        <div className="text-sm text-gray-600">ক্যাটেগরি</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="content">
                    <Card>
                        <CardHeader>
                            <CardTitle>কন্টেন্ট সেটিংস</CardTitle>
                            <CardDescription>সাইটের কন্টেন্ট এবং ফিচার নিয়ন্ত্রণ করুন</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="postsPerPage">প্রতি পেজে পোস্ট সংখ্যা</Label>
                                <Input
                                    id="postsPerPage"
                                    type="number"
                                    value={localSettings.postsPerPage}
                                    onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                                    min="1"
                                    max="50"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>মন্তব্য সক্রিয়</Label>
                                        <p className="text-sm text-gray-500">ইউজাররা পোস্টে মন্তব্য করতে পারবে</p>
                                    </div>
                                    <Switch
                                        checked={localSettings.enableComments}
                                        onCheckedChange={(checked) => handleInputChange('enableComments', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>নিউজলেটার সক্রিয়</Label>
                                        <p className="text-sm text-gray-500">ইউজাররা নিউজলেটার সাবস্ক্রাইব করতে পারবে</p>
                                    </div>
                                    <Switch
                                        checked={localSettings.enableNewsletter}
                                        onCheckedChange={(checked) => handleInputChange('enableNewsletter', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>বিজ্ঞাপন সক্রিয়</Label>
                                        <p className="text-sm text-gray-500">সাইটে বিজ্ঞাপন দেখানো হবে</p>
                                    </div>
                                    <Switch
                                        checked={localSettings.enableAds}
                                        onCheckedChange={(checked) => handleInputChange('enableAds', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="social">
                    <Card>
                        <CardHeader>
                            <CardTitle>সোশ্যাল মিডিয়া</CardTitle>
                            <CardDescription>আপনার সোশ্যাল মিডিয়া লিংক যোগ করুন</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="socialFacebook">ফেসবুক পেজ URL</Label>
                                <Input
                                    id="socialFacebook"
                                    value={localSettings.socialFacebook}
                                    onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                                    placeholder="https://facebook.com/yourpage"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="socialTwitter">টুইটার প্রোফাইল URL</Label>
                                <Input
                                    id="socialTwitter"
                                    value={localSettings.socialTwitter}
                                    onChange={(e) => handleInputChange('socialTwitter', e.target.value)}
                                    placeholder="https://twitter.com/yourhandle"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="socialYoutube">ইউটিউব চ্যানেল URL</Label>
                                <Input
                                    id="socialYoutube"
                                    value={localSettings.socialYoutube}
                                    onChange={(e) => handleInputChange('socialYoutube', e.target.value)}
                                    placeholder="https://youtube.com/c/yourchannel"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>নিরাপত্তা ও রক্ষণাবেক্ষণ</CardTitle>
                            <CardDescription>সাইটের নিরাপত্তা এবং রক্ষণাবেক্ষণ সেটিংস</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>রক্ষণাবেক্ষণ মোড</Label>
                                    <p className="text-sm text-gray-500">সাইট অস্থায়ীভাবে বন্ধ করুন</p>
                                </div>
                                <Switch
                                    checked={localSettings.maintenanceMode}
                                    onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                                />
                            </div>

                            {localSettings.maintenanceMode && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ রক্ষণাবেক্ষণ মোড সক্রিয় থাকলে শুধুমাত্র অ্যাডমিনরা সাইট দেখতে পাবেন।
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="font-medium">দ্রুত ক্রিয়া</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="justify-start">
                                        ক্যাশ পরিষ্কার করুন
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        ডাটাবেস অপ্টিমাইজ করুন
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="flex items-center gap-2" disabled={updateMutation.isPending}>
                    <Save className="w-4 h-4" />
                    {updateMutation.isPending ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}
                </Button>
            </div>
        </div>
    );
}
