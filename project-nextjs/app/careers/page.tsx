import { Briefcase, Users, Award, TrendingUp } from 'lucide-react';

export default function CareersPage() {
    const jobOpenings = [
        {
            id: 1,
            title: "সিনিয়র সাংবাদিক",
            department: "সম্পাদকীয়",
            location: "ঢাকা",
            type: "পূর্ণকালীন",
            description: "অভিজ্ঞ সাংবাদিক যিনি জাতীয় ও আন্তর্জাতিক বিষয়ে রিপোর্ট করতে পারবেন।"
        },
        {
            id: 2,
            title: "ওয়েব ডেভেলপার",
            department: "প্রযুক্তি",
            location: "ঢাকা",
            type: "পূর্ণকালীন",
            description: "React এবং Node.js এ অভিজ্ঞ ডেভেলপার যিনি আমাদের ওয়েবসাইট উন্নত করতে পারবেন।"
        },
        {
            id: 3,
            title: "ডিজিটাল মার্কেটিং এক্সিকিউটিভ",
            department: "মার্কেটিং",
            location: "ঢাকা",
            type: "পূর্ণকালীন",
            description: "সোশ্যাল মিডিয়া এবং ডিজিটাল মার্কেটিং এ অভিজ্ঞতা সম্পন্ন প্রার্থী।"
        }
    ];

    const benefits = [
        {
            icon: <Briefcase className="w-8 h-8 text-blue-600" />,
            title: "প্রতিযোগিতামূলক বেতন",
            description: "আপনার দক্ষতা এবং অভিজ্ঞতা অনুযায়ী আকর্ষণীয় বেতন"
        },
        {
            icon: <Users className="w-8 h-8 text-blue-600" />,
            title: "দলগত কাজের পরিবেশ",
            description: "একটি সহযোগিতামূলক এবং বন্ধুত্বপূর্ণ কর্মপরিবেশ"
        },
        {
            icon: <Award className="w-8 h-8 text-blue-600" />,
            title: "প্রশিক্ষণ ও উন্নয়ন",
            description: "নিয়মিত প্রশিক্ষণ এবং পেশাগত উন্নয়নের সুযোগ"
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
            title: "ক্যারিয়ার অগ্রগতি",
            description: "দ্রুত ক্যারিয়ার বৃদ্ধির সুযোগ এবং পদোন্নতি"
        }
    ];

    return (
        <main className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">ক্যারিয়ার</h1>

                <div className="text-center mb-12">
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        NewsViewBD-তে যোগ দিন এবং বাংলাদেশের সংবাদ মাধ্যমের ভবিষ্যৎ গড়তে অংশগ্রহণ করুন।
                        আমরা প্রতিভাবান ও উৎসাহী ব্যক্তিদের খুঁজছি যারা আমাদের মিশনে অংশীদার হতে চান।
                    </p>
                </div>

                {/* Benefits Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">কেন NewsViewBD-তে কাজ করবেন?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job Openings */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">বর্তমান চাকরির সুযোগ</h2>
                    <div className="space-y-6">
                        {jobOpenings.map((job) => (
                            <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                            <span>বিভাগ: {job.department}</span>
                                            <span>স্থান: {job.location}</span>
                                            <span>ধরন: {job.type}</span>
                                        </div>
                                    </div>
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                                        আবেদন করুন
                                    </button>
                                </div>
                                <p className="text-gray-700">{job.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Process */}
                <div className="bg-gray-50 rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">আবেদনের প্রক্রিয়া</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                ১
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">আবেদন জমা দিন</h3>
                            <p className="text-gray-600">আপনার সিভি এবং কভার লেটার careers@newsviewbd.com এ পাঠান</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                ২
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">প্রাথমিক নির্বাচন</h3>
                            <p className="text-gray-600">আমাদের HR টিম আপনার আবেদন পর্যালোচনা করবে</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                ৩
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">সাক্ষাৎকার</h3>
                            <p className="text-gray-600">নির্বাচিত প্রার্থীদের সাক্ষাৎকারের জন্য ডাকা হবে</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
