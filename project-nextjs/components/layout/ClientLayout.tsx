'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ui/ScrollToTop";
import BackToTopButton from "@/components/ui/BackToTopButton";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <>
            <ScrollToTop />
            {isAdminRoute ? (
                // Admin routes: no header/footer, just the children
                children
            ) : (
                // Public routes: with header and footer
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                    <BackToTopButton />
                </div>
            )}
            <Toaster />
        </>
    );
}
