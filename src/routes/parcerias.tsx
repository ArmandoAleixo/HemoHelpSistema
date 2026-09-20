import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";
export const Route = createFileRoute("/parcerias")({ head: () => ({ meta: [{ title: "Parcerias - HemoHelp Sistema" }, { name: "description", content: "Gestão de organizações parceiras." }, { property: "og:title", content: "Parcerias - HemoHelp Sistema" }, { property: "og:description", content: "Gestão de organizações parceiras." }] }), component: () => <CrudPage areaKey="parcerias" /> });
