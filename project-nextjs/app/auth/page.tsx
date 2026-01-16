'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: "লগইন ত্রুটি",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "সফল!",
                    description: "আপনি সফলভাবে লগইন করেছেন।",
                });
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "লগইন করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }

        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: "রেজিস্ট্রেশন ত্রুটি",
                    description: data.error || "রেজিস্টার করতে সমস্যা হয়েছে।",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "সফল!",
                    description: "আপনি সফলভাবে রেজিস্টার করেছেন। এখন লগইন করুন।",
                });
                // Clear form
                setFullName('');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            toast({
                title: "ত্রুটি",
                description: "রেজিস্টার করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link href="/" className="flex justify-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">NewsViewBD</h1>
                    </Link>
                    <p className="mt-2 text-gray-600">বাংলাদেশের অগ্রণী সংবাদ পোর্টাল</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">অ্যাকাউন্ট</CardTitle>
                        <CardDescription className="text-center">
                            লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="signin">লগইন</TabsTrigger>
                                <TabsTrigger value="signup">রেজিস্টার</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signin">
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">ইমেইল</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="আপনার ইমেইল"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="password">পাসওয়ার্ড</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="আপনার পাসওয়ার্ড"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div>
                                        <Label htmlFor="fullName">পূর্ণ নাম</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="আপনার পূর্ণ নাম"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="signup-email">ইমেইল</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="আপনার ইমেইল"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="আপনার পাসওয়ার্ড"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার করুন'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link href="/" className="text-sm text-gray-600 hover:text-black">
                        ← হোমে ফিরে যান
                    </Link>
                </div>
            </div>
        </div>
    );
}
