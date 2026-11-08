import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/features/site/components/Header";
import { Hero } from "@/features/site/components/Hero";
import { EstoqueSection } from "@/features/site/components/EstoqueSection";
import { CampanhasSection } from "@/features/site/components/CampanhasSection";
import { LocaisSection } from "@/features/site/components/LocaisSection";
import { CriteriosSection } from "@/features/site/components/CriteriosSection";
import { SobreSection } from "@/features/site/components/SobreSection";
import { Footer } from "@/features/site/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HemoHelp - Doe sangue, salve vidas" },
      {
        name: "description",
        content: "Encontre locais de doação, acompanhe o estoque e participe das campanhas.",
      },
    ],
  }),
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
