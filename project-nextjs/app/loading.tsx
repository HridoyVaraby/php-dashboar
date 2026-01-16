export default function Loading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-black rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium animate-pulse">লোড হচ্ছে...</p>
        </div>
    );
}
