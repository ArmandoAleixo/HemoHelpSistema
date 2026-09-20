import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/gestao/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral — Coleta Azul" },
      { name: "description", content: "Painel de gestão integrada da Coleta Azul." },
      { property: "og:title", content: "Visão geral — Coleta Azul" },
      { property: "og:description", content: "Painel de gestão integrada da Coleta Azul." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
