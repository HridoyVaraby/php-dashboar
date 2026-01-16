'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        // Check if user is authenticated and has admin/editor role
        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            router.push('/auth');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
        return null;
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar />
                <SidebarInset className="flex-1">
                    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="flex items-center gap-2 flex-1">
                            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                        </div>
                    </header>
                    <main className="flex-1 p-6 bg-gray-50">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
