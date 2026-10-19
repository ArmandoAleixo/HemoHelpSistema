import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SobreSection } from "@/components/landing/SobreSection";
import { Hero } from "@/components/landing/Hero";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre - HemoHelp" }] }),
  component: () => (
    <div className="landing flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <SobreSection />
      </main>
      <Footer />
    </div>
  ),
});
