import HeroSection from "@/component/Home/HeroSection";
import FeaturesRow from "@/component/Home/FeaturesRow";
import BuiltForAfrica from "@/component/Home/BuiltForAfrica";
import BottomSection from "@/component/Home/BottomSection";
import MainLayout from "@/component/MainLayout"

export default function Home() {
  return (
    <main className="w-full">
      <MainLayout>
      <HeroSection />
      <FeaturesRow />
      <BuiltForAfrica />
      <BottomSection />
      </MainLayout>
    </main>
  );
}
