import HeroSection from "@/component/Home/HeroSection";
import FeaturesRow from "@/component/Home/FeaturesRow";
import BuiltForAfrica from "@/component/Home/BuiltForAfrica";
import BottomSection from "@/component/Home/BottomSection";

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturesRow />
      <BuiltForAfrica />
      <BottomSection />
    </main>
  );
}
