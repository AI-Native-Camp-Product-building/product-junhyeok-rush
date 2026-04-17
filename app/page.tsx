"use client";

import { useEffect } from "react";
import {
  Navigation,
  HeroSection,
  ProblemSection,
  HowItWorksSection,
  FeaturesSection,
  CurriculumSection,
  ScienceSection,
  AdhdPrinciplesSection,
  HowToStartSection,
  ApiSection,
  CtaSection,
  Footer,
} from "@/components/landing";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CurriculumSection />
      <ScienceSection />
      <AdhdPrinciplesSection />
      <HowToStartSection />
      <ApiSection />
      <CtaSection />
      <Footer />
    </>
  );
}
