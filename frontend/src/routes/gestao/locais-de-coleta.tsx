import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/features/gestao/components/crud-page";
export const Route = createFileRoute("/gestao/locais-de-coleta")({
  head: () => ({
    meta: [
      { title: "Locais de coleta - HemoHelp Sistema" },
      { name: "description", content: "Cadastro de pontos de coleta." },
      { property: "og:title", content: "Locais de coleta - HemoHelp Sistema" },
      { property: "og:description", content: "Cadastro de pontos de coleta." },
    ],
  }),
  component: () => <CrudPage areaKey="locais" />,
});
