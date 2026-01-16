export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">সেবার শর্তাবলী</h1>

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                    <p className="text-lg text-gray-600 mb-8">
                        NewsViewBD ওয়েবসাইট ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলী সম্পূর্ণ পড়ুন। আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন।
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">১. সাধারণ শর্তাবলী</h2>
                    <p className="mb-6">
                        NewsViewBD একটি অনলাইন সংবাদ প্ল্যাটফর্ম যা বাংলাদেশি এবং আন্তর্জাতিক সংবাদ প্রকাশ করে। আমাদের ওয়েবসাইট ব্যবহার করে আপনি নিম্নলিখিত শর্তাবলী মেনে চলতে সম্মত হচ্ছেন।
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">২. ব্যবহারের শর্তাবলী</h2>
                    <ul className="list-disc list-inside mb-6 space-y-2">
                        <li>আপনি অবৈধ কোনো উদ্দেশ্যে এই ওয়েবসাইট ব্যবহার করতে পারবেন না</li>
                        <li>অন্যের কপিরাইট বা বুদ্ধিবৃত্তিক সম্পদের অধিকার লঙ্ঘন করতে পারবেন না</li>
                        <li>কোনো ভাইরাস, ম্যালওয়্যার বা ক্ষতিকর কোড আপলোড করতে পারবেন না</li>
                        <li>অন্য ব্যবহারকারীদের হয়রানি বা অপমান করতে পারবেন না</li>
                        <li>মিথ্যা তথ্য বা বিভ্রান্তিকর কন্টেন্ট শেয়ার করতে পারবেন না</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৩. কন্টেন্ট এবং কপিরাইট</h2>
                    <p className="mb-6">
                        NewsViewBD-তে প্রকাশিত সকল কন্টেন্ট আমাদের সম্পত্তি বা আমাদের লাইসেন্স রয়েছে। আপনি ব্যক্তিগত ব্যবহারের জন্য কন্টেন্ট দেখতে এবং ডাউনলোড করতে পারেন, কিন্তু বাণিজ্যিক উদ্দেশ্যে ব্যবহার করতে পারবেন না।
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৪. দায়বদ্ধতার সীমাবদ্ধতা</h2>
                    <p className="mb-6">
                        NewsViewBD নিম্নলিখিত বিষয়ে দায়ী নয়:
                    </p>
                    <ul className="list-disc list-inside mb-6 space-y-2">
                        <li>তথ্যের যথার্থতা বা সম্পূর্ণতা</li>
                        <li>ওয়েবসাইট ব্যবহারের ফলে কোনো ক্ষতি</li>
                        <li>তৃতীয় পক্ষের ওয়েবসাইটের লিংক বা কন্টেন্ট</li>
                        <li>সাইটে প্রযুক্তিগত সমস্যা বা ডাউনটাইম</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৫. গোপনীয়তা</h2>
                    <p className="mb-6">
                        আপনার ব্যক্তিগত তথ্যের ব্যবহার আমাদের <a href="/privacy" className="text-blue-600 hover:underline">গোপনীয়তা নীতি</a> অনুযায়ী পরিচালিত হবে।
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">৬. যোগাযোগ</h2>
                    <p>
                        এই শর্তাবলী সম্পর্কে কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:
                        <br />
                        ইমেইল: legal@newsviewbd.com
                        <br />
                        ফোন: +৮৮ ০১৭৯৪ ৫৬৯৮৫৫
                    </p>

                    <p className="text-sm text-gray-500 mt-8">
                        সর্বশেষ আপডেট: ২৭ মে, ২০২৪
                    </p>
                </div>
            </div>
        </main>
    );
}
