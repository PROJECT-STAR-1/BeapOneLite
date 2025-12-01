import Container from "./Container";
import { CheckCircle } from "lucide-react";

const items = [
  "Works offline, syncs when connected",
  "Support for 50+ currencies with live rates",
  "Multi-location and multi-user management",
  "Simple pricing that scales with you",
];

export default function BuiltForAfrica() {
  return (
    <section className="bg-indigo-900 py-28 text-white relative overflow-hidden">
      <Container className="relative z-10">
        <h2 className="text-5xl font-bold leading-tight">
          Built for <br /> African businesses
        </h2>

        <p className="mt-6 max-w-xl text-lg text-indigo-200">
          Multi-currency support, offline mode, and mobile-first design.
          Everything you need to run your business from anywhere.
        </p>

        <ul className="mt-10 space-y-6">
          {items.map((text) => (
            <li key={text} className="flex items-start gap-3">
              <CheckCircle className="text-yellow-400" />
              <span className="text-lg">{text}</span>
            </li>
          ))}
        </ul>
      </Container>

      {/* Decorative floating shapes background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15),_transparent_70%)]"></div>
    </section>
  );
}
