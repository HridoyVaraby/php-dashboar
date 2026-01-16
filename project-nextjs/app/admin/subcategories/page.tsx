'use client';

import SubcategoriesManagement from '@/components/admin/SubcategoriesManagement';

export default function SubcategoriesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">সাবক্যাটেগরি ম্যানেজমেন্ট</h1>
                <p className="text-gray-600">সাবক্যাটেগরি তৈরি, সম্পাদনা এবং মুছে ফেলুন</p>
            </div>
            <SubcategoriesManagement />
        </div>
    );
}
