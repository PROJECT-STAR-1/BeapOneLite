import { Zap, Shield, Globe, Smartphone } from "lucide-react";
import Container from "./Container";

const features = [
  { icon: Zap, label: "Fast Setup" },
  { icon: Shield, label: "Secure" },
  { icon: Globe, label: "Multi-Currency" },
  { icon: Smartphone, label: "Mobile First" },
];

export default function FeaturesRow() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
          {features.map(({ icon: Icon, label }) => (
            <div key={label}>
              <div className="mx-auto flex items-center justify-center w-20 h-20 bg-purple-50 rounded-2xl">
                <Icon size={36} className="text-indigo-900" />
              </div>
              <p className="mt-4 text-gray-700 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
