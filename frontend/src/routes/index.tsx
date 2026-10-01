import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/gestao/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral - HemoHelp Sistema" },
      { name: "description", content: "Painel de gestão integrada do HemoHelp Sistema." },
      { property: "og:title", content: "Visão geral - HemoHelp Sistema" },
      { property: "og:description", content: "Painel de gestão integrada do HemoHelp Sistema." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
