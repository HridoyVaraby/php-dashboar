'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Mail } from 'lucide-react';

interface ProfileData {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    createdAt: string;
}

export default function ProfilePage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { data: profile, isLoading } = useQuery<ProfileData>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await fetch('/api/profile');
            if (!response.ok) throw new Error('Failed to fetch profile');
            const data = await response.json();
            setFullName(data.fullName);
            setEmail(data.email);
            return data;
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (data: { fullName: string }) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update profile');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast({
                title: 'সফল',
                description: 'প্রোফাইল আপডেট হয়েছে।',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'ত্রুটি',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to change password');
            }
            return response.json();
        },
        onSuccess: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            toast({
                title: 'সফল',
                description: 'পাসওয়ার্ড পরিবর্তন হয়েছে।',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'ত্রুটি',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const handleUpdateProfile = () => {
        updateProfileMutation.mutate({ fullName });
    };

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            toast({
                title: 'ত্রুটি',
                description: 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।',
                variant: 'destructive',
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: 'ত্রুটি',
                description: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
                variant: 'destructive',
            });
            return;
        }

        changePasswordMutation.mutate({ currentPassword, newPassword });
    };

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">প্রোফাইল</h1>
                <p className="text-gray-600">আপনার প্রোফাইল তথ্য পরিচালনা করুন</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            প্রোফাইল তথ্য
                        </CardTitle>
                        <CardDescription>আপনার নাম এবং ইমেইল আপডেট করুন</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">পূর্ণ নাম</Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">ইমেইল</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>রোল</Label>
                            <Input value={profile?.role || ''} disabled />
                        </div>

                        <Button
                            onClick={handleUpdateProfile}
                            disabled={updateProfileMutation.isPending}
                            className="w-full"
                        >
                            {updateProfileMutation.isPending ? 'আপডেট হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Change Password Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            পাসওয়ার্ড পরিবর্তন
                        </CardTitle>
                        <CardDescription>আপনার পাসওয়ার্ড পরিবর্তন করুন</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">বর্তমান পাসওয়ার্ড</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleChangePassword}
                            disabled={changePasswordMutation.isPending}
                            className="w-full"
                            variant="secondary"
                        >
                            {changePasswordMutation.isPending ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Account Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        অ্যাকাউন্ট তথ্য
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">অ্যাকাউন্ট ID</p>
                            <p className="font-medium font-mono text-xs">{profile?.id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">তৈরির তারিখ</p>
                            <p className="font-medium">
                                {profile?.createdAt
                                    ? new Date(profile.createdAt).toLocaleDateString('bn-BD')
                                    : ''}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
