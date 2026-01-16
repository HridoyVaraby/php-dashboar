export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">আমাদের সম্পর্কে</h1>

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    <p className="text-xl text-gray-600 mb-8">
                        NewsViewBD হল বাংলাদেশের একটি অগ্রণী অনলাইন সংবাদ প্ল্যাটফর্ম যা বিশ্বস্ত এবং নির্ভরযোগ্য সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ।
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">আমাদের লক্ষ্য</h2>
                    <p className="mb-6">
                        আমাদের প্রধান লক্ষ্য হল সত্য, নিরপেক্ষ এবং যাচাইকৃত সংবাদ পাঠকদের কাছে পৌঁছে দেওয়া। আমরা বিশ্বাস করি যে সঠিক তথ্যের অধিকার প্রতিটি নাগরিকের মৌলিক অধিকার।
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">আমাদের মূল্যবোধ</h2>
                    <ul className="list-disc list-inside mb-6 space-y-2">
                        <li>সত্যতা এবং নির্ভরযোগ্যতা</li>
                        <li>নিরপেক্ষতা এবং ভারসাম্য</li>
                        <li>স্বচ্ছতা এবং জবাবদিহিতা</li>
                        <li>সামাজিক দায়বদ্ধতা</li>
                        <li>পেশাদারিত্ব এবং নৈতিকতা</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">আমাদের দল</h2>
                    <p className="mb-6">
                        NewsViewBD-তে একদল অভিজ্ঞ সাংবাদিক, সম্পাদক এবং প্রযুক্তিবিদ কাজ করেন যারা সবাই মানসম্পন্ন সংবাদ পরিবেশনে নিবেদিতপ্রাণ। আমাদের দল ২৪/৭ কাজ করে যাতে পাঠকরা সর্বশেষ এবং গুরুত্বপূর্ণ সংবাদ পেতে পারেন।
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">যোগাযোগ করুন</h2>
                    <p>
                        আমাদের সাথে যোগাযোগ করতে চাইলে অনুগ্রহ করে আমাদের <a href="/contact" className="text-blue-600 hover:underline">যোগাযোগ</a> পাতায় যান অথবা info@newsviewbd.com এ ইমেইল করুন।
                    </p>
                </div>
            </div>
        </main>
    );
}
