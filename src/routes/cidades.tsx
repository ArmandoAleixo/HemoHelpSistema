import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";
export const Route = createFileRoute("/cidades")({ head: () => ({ meta: [{ title: "Cidades - HemoHelp Sistema" }, { name: "description", content: "Gestão das cidades atendidas." }, { property: "og:title", content: "Cidades - HemoHelp Sistema" }, { property: "og:description", content: "Gestão das cidades atendidas." }] }), component: () => <CrudPage areaKey="cidades" /> });
