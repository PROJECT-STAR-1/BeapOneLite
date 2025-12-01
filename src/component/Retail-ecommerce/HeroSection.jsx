import RetailEcommerceSection from "./RetailEcommerceSection";
import ProfessionalServicesSection from "./ProfessionalServicesSection";
import WholesaleDistributionSection from "./WholesaleDistributionSection";
import HospitalityFoodServiceSection from "./HospitalityFoodServiceSection";
export default function HeroSection () {
  return (
    <main className="w-full bg-blue-50">

        <RetailEcommerceSection/>
        <ProfessionalServicesSection/>
        <WholesaleDistributionSection/>
        <HospitalityFoodServiceSection/>
      
    </main>
  );
}
