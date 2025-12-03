"use client";

import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";


export default function DefaultLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}