import BreakingNews from "@/components/sections/BreakingNews";
import HeroSection from "@/components/sections/HeroSection";
import CategoryPosts from "@/components/sections/CategoryPosts";
import LatestNews from "@/components/sections/LatestNews";
import AdBanner from "@/components/sections/AdBanner";
import FeaturedVideos from "@/components/sections/FeaturedVideos";
import CategoryTabs from "@/components/sections/CategoryTabs";
import OpinionSection from "@/components/sections/OpinionSection";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-bangla">
      <BreakingNews />
      <main>
        <HeroSection />
        <CategoryPosts />
        <LatestNews />
        <AdBanner />
        <FeaturedVideos />
        <CategoryTabs />
        <OpinionSection />
        <Newsletter />
      </main>
    </div>
  );
}
