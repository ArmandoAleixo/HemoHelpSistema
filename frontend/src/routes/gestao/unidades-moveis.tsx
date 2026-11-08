import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/features/gestao/components/crud-page";
export const Route = createFileRoute("/gestao/unidades-moveis")({
  head: () => ({
    meta: [
      { title: "Unidades móveis - HemoHelp Sistema" },
      { name: "description", content: "Gestão de unidades móveis e equipes." },
      { property: "og:title", content: "Unidades móveis - HemoHelp Sistema" },
      { property: "og:description", content: "Gestão de unidades móveis e equipes." },
    ],
  }),
  component: () => <CrudPage areaKey="unidades" />,
});
