'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
    Home,
    FileText,
    Tags,
    MessageSquare,
    Video,
    Edit,
    Users,
    Mail,
    BarChart3,
    Settings,
    LogOut,
    FolderTree,
    UserCircle,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
    {
        title: 'ড্যাশবোর্ড',
        url: '/admin',
        icon: Home,
    },
    {
        title: 'পোস্টস',
        url: '/admin/posts',
        icon: FileText,
    },
    {
        title: 'ক্যাটেগরি',
        url: '/admin/categories',
        icon: Tags,
    },
    {
        title: 'সাবক্যাটেগরি',
        url: '/admin/subcategories',
        icon: FolderTree,
    },
    {
        title: 'ট্যাগস',
        url: '/admin/tags',
        icon: Tags,
    },
    {
        title: 'মন্তব্য',
        url: '/admin/comments',
        icon: MessageSquare,
    },
    {
        title: 'ভিডিও',
        url: '/admin/videos',
        icon: Video,
    },
    {
        title: 'মতামত',
        url: '/admin/opinions',
        icon: Edit,
    },
    {
        title: 'ইউজার',
        url: '/admin/users',
        icon: Users,
    },
    {
        title: 'নিউজলেটার',
        url: '/admin/newsletter',
        icon: Mail,
    },
    {
        title: 'বিজ্ঞাপন',
        url: '/admin/ads',
        icon: BarChart3,
    },
    {
        title: 'প্রোফাইল',
        url: '/admin/profile',
        icon: UserCircle,
    },
    // {
    //     title: 'সেটিংস',
    //     url: '/admin/settings',
    //     icon: Settings,
    // },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <Sidebar className="font-bangla">
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 px-4 py-2">
                    <img src="/Icon.svg" alt="Icon" className="h-8" />
                    <img src="/logo.svg" alt="NewsViewBD" className="h-8" />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>অ্যাডমিন প্যানেল</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {user && (
                        <SidebarMenuItem>
                            <div className="px-4 py-2 text-sm text-gray-600">
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs">{user.role}</div>
                            </div>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleSignOut}>
                            <LogOut />
                            <span>লগআউট</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
