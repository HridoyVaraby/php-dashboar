'use client';

import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";

const Footer = () => {
    const { data: categories } = useCategories();

    // Prepare footer categories: remove 'ধর্ম', place 'সাহিত্য-সংস্কৃতি' last, limit to 6
    const footerCategories = (() => {
        if (!categories) return null;
        const filtered = categories.filter((c) => c.name !== 'ধর্ম');
        const sahitya = filtered.find((c) => c.name === 'সাহিত্য-সংস্কৃতি');
        const withoutSahitya = filtered.filter((c) => c.name !== 'সাহিত্য-সংস্কৃতি');
        const limited = withoutSahitya.slice(0, 5);
        return sahitya ? [...limited, sahitya] : withoutSahitya.slice(0, 6);
    })();

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="container mx-auto px-4">
                {/* Main Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <img src="/Icon.svg" alt="Icon" className="h-8" />
                            <img src="/logo_white.svg" alt="NewsViewBD" className="h-8" />
                        </div>
                        <p className="text-gray-400 text-sm mb-4 font-medium">শুধু সংবাদ নয়, স্বপ্নের সঙ্গেও</p>

                        {/* Editor Information */}
                        <div className="mb-4 text-sm text-gray-400">
                            <p>প্রকাশক: কাজল কানন</p>
                            <p>সম্পাদক: রহমান সিদ্দিক</p>
                            {/* <p>নির্বাহী সম্পাদক: কাজল কানন</p>
                                <p>ব্যবস্থাপনা সম্পাদক: ধীমান সাহা জুয়েল</p> */}
                        </div>

                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/newsviewbd/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href="https://twitter.com" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                </svg>
                            </a>
                            <a href="https://instagram.com" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.504-.344-1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@newsviewbangladesh" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 01 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">বিভাগসমূহ</h3>
                        <ul className="space-y-2">
                            {footerCategories?.map((category) => (
                                <li key={category.id}>
                                    <Link href={`/category/${category.slug}`} className="text-gray-400 hover:text-white transition-colors">
                                        {category.name}
                                    </Link>
                                </li>
                            )) || (
                                    <>
                                        <li><Link href="/category/bangladesh" className="text-gray-400 hover:text-white transition-colors">বাংলাদেশ</Link></li>
                                        <li><Link href="/category/international" className="text-gray-400 hover:text-white transition-colors">আন্তর্জাতিক</Link></li>
                                        <li><Link href="/category/politics" className="text-gray-400 hover:text-white transition-colors">রাজনীতি</Link></li>
                                        <li><Link href="/category/business" className="text-gray-400 hover:text-white transition-colors">ব্যবসা</Link></li>
                                        <li><Link href="/category/technology" className="text-gray-400 hover:text-white transition-colors">প্রযুক্তি</Link></li>
                                        <li><Link href="/category/sports" className="text-gray-400 hover:text-white transition-colors">খেলা</Link></li>
                                    </>
                                )}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">কোম্পানি</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">আমাদের সম্পর্কে</Link></li>
                            <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">ক্যারিয়ার</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">যোগাযোগ</Link></li>
                            <li><Link href="/advertise" className="text-gray-400 hover:text-white transition-colors">বিজ্ঞাপন দিন</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">গোপনীয়তা নীতি</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">সেবার শর্তাবলী</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">যোগাযোগ করুন</h3>
                        <address className="text-gray-400 not-italic">
                            <p className="mb-2">২৩১/৯ হক প্লাজা (২য় তলা), চাষাড়া, নারায়ণঞ্জ।</p>
                            <p className="mb-2">ইমেইল: info@newsviewbd.com</p>
                            <p className="mb-2">ফোন: +৮৮ ০১৭৯৪ ৫৬৯৮৫৫</p>
                            <p className="mb-2">ফোন: +৮৮ ০১৩২৫ ৪৪৯৫৩৩</p>
                        </address>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; ২০২৫{" "}
                            <Link href="/" className="text-white hover:text-gray-300 transition-colors">
                                নিউজভিউ
                            </Link>
                            . সর্বস্বত্ব সংরক্ষিত। কারিগরি সহায়তায়{" "}
                            <a
                                href="https://varabit.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                ভারাবীট ওয়েব ডিজাইন & ডেভেলপমেন্ট
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
