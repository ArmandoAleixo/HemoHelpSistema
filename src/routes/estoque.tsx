import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";

export const Route = createFileRoute("/estoque")({
  head: () => ({
    meta: [
      { title: "Estoque - HemoHelp Sistema" },
      { name: "description", content: "Controle de estoque do HemoHelp Sistema." },
      { property: "og:title", content: "Estoque - HemoHelp Sistema" },
      { property: "og:description", content: "Controle de estoque do HemoHelp Sistema." },
    ],
  }),
  component: () => <CrudPage areaKey="estoque" />,
});
