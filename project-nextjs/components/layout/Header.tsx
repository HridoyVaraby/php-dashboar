'use client';

import React, { useState } from "react";
import { Search, Calendar, X, Menu } from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";
import { useSearch } from "@/hooks/use-search";
import { useAuth } from "@/hooks/use-auth";
import SearchResults from "./SearchResults";
import UserMenu from "./UserMenu";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const { data: categories } = useCategories();
    const { searchResults, isLoading, isSearching, performSearch, clearSearch } = useSearch();
    const { user, canAccessDashboard, signOut } = useAuth();

    const getCurrentDate = () => {
        const today = new Date();

        // English calendar date in Bengali locale
        const englishDate = today.toLocaleDateString('bn-BD', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        // Bengali calendar date
        let bDate = '';
        try {
            // using require to avoid potential top-level ESM issues during build if any
            const { formatBanglaDate } = require('bengali-calendar');
            if (typeof formatBanglaDate === 'function') {
                bDate = formatBanglaDate(today);
            }
        } catch (e) {
            console.error("Bengali calendar error:", e);
        }

        return bDate ? `${englishDate} | ${bDate}` : englishDate;
    };

    // Define category order and mapping with updated categories
    const categoryOrder = [
        'নারায়ণগঞ্জ', 'বিশেষ', 'রাজনীতি', 'অর্থ-বাণিজ্য', 'বাংলাদেশ',
        'বিশ্ব', 'শিক্ষা', 'আদালত', 'স্বাস্থ্য', 'প্রযুক্তি',
        'সংস্কৃতি', 'বিনোদন', 'সাহিত্য-সংস্কৃতি'
    ];

    const getOrderedCategories = () => {
        if (!categories) return [];

        const categoriesMap = new Map();
        categories.forEach(cat => {
            categoriesMap.set(cat.name.trim(), cat);
        });

        const orderedCategories = categoryOrder
            .map(name => {
                const category = categoriesMap.get(name.trim());
                return category;
            })
            .filter(Boolean);

        return orderedCategories;
    };

    const navigationCategories = getOrderedCategories();

    // Narayanganj subcategories with proper routing
    const narayanganjSubcategories = [
        { name: 'আড়াইহাজার', slug: 'araihajar' },
        { name: 'বন্দর', slug: 'bandar' },
        { name: 'রূপগঞ্জ', slug: 'rupgonj' },
        { name: 'সদর', slug: 'sadar' },
        { name: 'সোনারগাঁও', slug: 'sonargoan' },
    ];

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            performSearch(searchInput.trim());
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);

        if (value.trim()) {
            performSearch(value.trim());
        } else {
            clearSearch();
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        clearSearch();
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            {/* Top Date Bar */}
            <div className="bg-gray-50 py-2 hidden md:block">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{getCurrentDate()}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    {canAccessDashboard && (
                                        <Link href="/admin" className="hover:text-black transition-colors">ড্যাশবোর্ড</Link>
                                    )}
                                    <UserMenu />
                                </div>
                            ) : (
                                <Link href="/auth" className="hover:text-black transition-colors">লগইন</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo with Slogan */}
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/Icon.svg" alt="Icon" className="h-10 md:h-16" />
                        <div className="flex flex-col items-start">
                            <img src="/logo.svg" alt="NewsViewBD" className="h-8 md:h-12" />
                            <span className="text-[10px] md:text-sm text-gray-600 mt-1 font-medium text-right w-full hidden sm:block">শুধু সংবাদ নয়, স্বপ্নের সঙ্গেও</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <NavigationMenu>
                            <NavigationMenuList className="space-x-1">
                                {navigationCategories.map((category) => (
                                    <NavigationMenuItem key={category.id}>
                                        {category.name === 'নারায়ণগঞ্জ' ? (
                                            <>
                                                <NavigationMenuTrigger className="text-gray-700 hover:text-black transition-colors text-sm bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100 px-2 py-2">
                                                    {category.name}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <div className="grid gap-1 p-3 w-56 bg-white">
                                                        <Link
                                                            href={`/category/${category.slug}`}
                                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                                                        >
                                                            সব খবর
                                                        </Link>
                                                        {narayanganjSubcategories.map((subcategory) => (
                                                            <Link
                                                                key={subcategory.slug}
                                                                href={`/category/narayanganj/${subcategory.slug}`}
                                                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                            >
                                                                {subcategory.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </NavigationMenuContent>
                                            </>
                                        ) : (
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="text-gray-700 hover:text-black transition-colors text-sm px-2 py-2 rounded-md hover:bg-gray-100 block cursor-pointer"
                                            >
                                                {category.name}
                                            </Link>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                                <NavigationMenuItem>
                                    <Link
                                        href="/videos"
                                        className="text-gray-700 hover:text-black transition-colors text-sm px-2 py-2 rounded-md hover:bg-gray-100 block cursor-pointer"
                                    >
                                        ভিডিও
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link
                                        href="/opinions"
                                        className="text-gray-700 hover:text-black transition-colors text-sm px-2 py-2 rounded-md hover:bg-gray-100 block cursor-pointer"
                                    >
                                        মতামত
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>

                    {/* Search Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <form onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="খুঁজুন..."
                                    value={searchInput}
                                    onChange={handleSearchInputChange}
                                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40 lg:w-60"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </form>

                            {isSearching && (
                                <SearchResults
                                    results={searchResults}
                                    isLoading={isLoading}
                                    onClose={clearSearch}
                                    query={searchInput}
                                />
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            {user && <UserMenu />}
                            <button
                                className="p-2"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="lg:hidden mt-4 py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            {/* Mobile Search */}
                            <div className="relative">
                                <form onSubmit={handleSearchSubmit}>
                                    <input
                                        type="text"
                                        placeholder="খুঁজুন..."
                                        value={searchInput}
                                        onChange={handleSearchInputChange}
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    {searchInput && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </form>

                                {isSearching && (
                                    <SearchResults
                                        results={searchResults}
                                        isLoading={isLoading}
                                        onClose={clearSearch}
                                        query={searchInput}
                                    />
                                )}
                            </div>

                            {navigationCategories.map((category) => (
                                <div key={category.id}>
                                    {category.name === 'নারায়ণগঞ্জ' ? (
                                        <div>
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className="text-gray-700 hover:text-black transition-colors block py-2 font-medium"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {category.name}
                                            </Link>
                                            <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                                                {narayanganjSubcategories.map((subcategory) => (
                                                    <Link
                                                        key={subcategory.slug}
                                                        href={`/category/narayanganj/${subcategory.slug}`}
                                                        className="text-gray-600 hover:text-black transition-colors block py-1 text-sm"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {subcategory.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/category/${category.slug}`}
                                            className="text-gray-700 hover:text-black transition-colors block py-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            <div>
                                <Link
                                    href="/videos"
                                    className="text-gray-700 hover:text-black transition-colors block py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ভিডিও
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href="/opinions"
                                    className="text-gray-700 hover:text-black transition-colors block py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    মতামত
                                </Link>
                            </div>

                            {!user && (
                                <Link
                                    href="/auth"
                                    className="block py-2 text-center bg-black text-white rounded-md mt-4"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    লগইন
                                </Link>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
