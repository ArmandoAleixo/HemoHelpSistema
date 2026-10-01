import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";
export const Route = createFileRoute("/campanhas")({ head: () => ({ meta: [{ title: "Campanhas - HemoHelp Sistema" }, { name: "description", content: "Gestão de campanhas sociais." }, { property: "og:title", content: "Campanhas - HemoHelp Sistema" }, { property: "og:description", content: "Gestão de campanhas sociais." }] }), component: () => <CrudPage areaKey="campanhas" /> });
