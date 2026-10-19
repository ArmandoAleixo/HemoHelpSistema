import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { EstoqueSection } from "@/components/landing/EstoqueSection";
import { CampanhasSection } from "@/components/landing/CampanhasSection";
import { LocaisSection } from "@/components/landing/LocaisSection";
import { CriteriosSection } from "@/components/landing/CriteriosSection";
import { SobreSection } from "@/components/landing/SobreSection";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre - HemoHelp" }] }),
  component: () => (
    <div className="landing flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <EstoqueSection />
        <CampanhasSection />
        <LocaisSection />
        <CriteriosSection />
        <SobreSection />
      </main>
      <Footer />
    </div>
  ),
});
