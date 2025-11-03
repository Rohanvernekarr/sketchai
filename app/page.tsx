"use client";

import { Footer } from "./components/landing/Footer";
import { Hero } from "./components/landing/Hero";
import { Navbar } from "./components/landing/Navbar";
import { Features } from "./components/landing/Features";
import { HowItWorks } from "./components/landing/HowitWorks";
import { Pricing } from "./components/landing/Pricing";
// import { ProductDemo } from "./components/landing/ProductDemo";
import { UseCases } from "./components/landing/UseCase";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      {/*<ProductDemo />*/}
      <UseCases />
      <Pricing />

      <Footer />
    </>
  );
}
