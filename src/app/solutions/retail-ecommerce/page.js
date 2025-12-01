import IndustrySolutions from "@/component/Retail-ecommerce/IndustrySolutions";
import HeroSection from "@/component/Retail-ecommerce/HeroSection";
import BusinessSizeSolutions from "@/component/Retail-ecommerce/BusinessSizeSolutions";
import PageFooter from "@/component/Retail-ecommerce/Footer";

export default function page() {
  return (
    <main className="w-full">
        <IndustrySolutions/>
        <HeroSection/>
        <BusinessSizeSolutions/>
        <PageFooter/>
      
    </main>
  );
}
