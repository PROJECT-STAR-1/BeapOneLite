import Image from "next/image";
import Container from "./Container";

export default function HeroSection() {
  return (
    <section className="pt-20 pb-16">
      <Container className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
            Trusted by 10,000+ African businesses
          </span>

          <h1 className="mt-8 text-6xl font-bold leading-tight">
            Financial <br /> control <br />
            <span className="text-gray-400">made simple</span>
          </h1>

          <p className="mt-8 text-lg text-gray-600">
            The business management platform built for African SMEs. Track
            expenses, send invoices, and manage your finances—all from your
            phone.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <button className="bg-indigo-900 text-white px-6 py-3 rounded-full font-medium text-lg">
              Start free trial
            </button>

            <button className="border px-6 py-3 rounded-full text-lg">
              ▶ Watch demo
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            No credit card required • Free plan available
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/hero-guy.png"
            alt="Business owner smiling"
            width={450}
            height={650}
            className="rounded-3xl object-cover shadow-lg"
          />
        </div>
      </Container>
    </section>
  );
}
