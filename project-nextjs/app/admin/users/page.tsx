'use client';

import { useUsers } from '@/hooks/use-users';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash2, Ban, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useSession } from 'next-auth/react';

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const { data: users, isLoading } = useUsers();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'READER',
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (!res.ok) throw new Error('Failed to update role');

            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({
                title: "সফল!",
                description: "ইউজার রোল আপডেট করা হয়েছে।",
            });
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: "ত্রুটি",
                description: "রোল আপডেট করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }
    };

    const handleStatusChange = async (userId: string, isSuspended: boolean) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isSuspended }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({
                title: "সফল!",
                description: isSuspended ? "ইউজার সাসপেন্ড করা হয়েছে।" : "ইউজার অ্যাক্টিভ করা হয়েছে।",
            });
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "ত্রুটি",
                description: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete user');

            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({
                title: "সফল!",
                description: "ইউজার ডিলিট করা হয়েছে।",
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: "ত্রুটি",
                description: "ইউজার ডিলিট করতে সমস্যা হয়েছে।",
                variant: "destructive",
            });
        }
    };

    const handleCreateUser = async () => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create user');
            }

            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsCreateOpen(false);
            setNewUser({ fullName: '', email: '', password: '', role: 'READER' });
            toast({
                title: "সফল!",
                description: "নতুন ইউজার তৈরি করা হয়েছে।",
            });
        } catch (error: any) {
            console.error('Error creating user:', error);
            toast({
                title: "ত্রুটি",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge className="bg-red-100 text-red-800">অ্যাডমিন</Badge>;
            case 'EDITOR':
                return <Badge className="bg-blue-100 text-blue-800">এডিটর</Badge>;
            case 'READER':
                return <Badge className="bg-gray-100 text-gray-800">রিডার</Badge>;
            default:
                return <Badge>{role}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">ইউজার ম্যানেজমেন্ট</h1>
                    <p className="text-gray-600 mt-1">সকল ইউজার এবং তাদের রোল পরিচালনা করুন</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            নতুন ইউজার
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>নতুন ইউজার তৈরি করুন</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">পুরো নাম</Label>
                                <Input
                                    id="fullName"
                                    value={newUser.fullName}
                                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                    placeholder="জন ডো"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">ইমেইল</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">পাসওয়ার্ড</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="********"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">রোল</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">অ্যাডমিন</SelectItem>
                                        <SelectItem value="EDITOR">এডিটর</SelectItem>
                                        <SelectItem value="READER">রিডার</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>বাতিল</Button>
                            <Button onClick={handleCreateUser}>তৈরি করুন</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ইউজার
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ইমেইল
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    রোল
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    স্ট্যাটাস
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    যোগদানের তারিখ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    অ্যাকশন
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        লোড হচ্ছে...
                                    </td>
                                </tr>
                            ) : users && users.length > 0 ? (
                                users.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {user.avatarUrl ? (
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt={user.fullName}
                                                        className="w-10 h-10 rounded-full mr-3"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                        <Shield className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                )}
                                                <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isSuspended ? (
                                                <Badge variant="destructive">সাসপেন্ডেড</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">অ্যাক্টিভ</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(value) => handleRoleChange(user.id, value)}
                                                    disabled={session?.user?.id === user.id}
                                                >
                                                    <SelectTrigger className="w-28 h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ADMIN">অ্যাডমিন</SelectItem>
                                                        <SelectItem value="EDITOR">এডিটর</SelectItem>
                                                        <SelectItem value="READER">রিডার</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {session?.user?.id !== user.id && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className={user.isSuspended ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
                                                            onClick={() => handleStatusChange(user.id, !user.isSuspended)}
                                                            title={user.isSuspended ? "অ্যাক্টিভ করুন" : "সাসপেন্ড করুন"}
                                                        >
                                                            {user.isSuspended ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        এই অ্যাকশনটি ফিরে আসা যাবে না। এটি স্থায়ীভাবে ইউজার এবং তার সমস্ত ডেটা মুছে ফেলবে।
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>বাতিল</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(user.id)}>
                                                                        মুছে ফেলুন
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        কোন ইউজার পাওয়া যায়নি
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
