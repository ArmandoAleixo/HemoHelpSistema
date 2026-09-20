import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";
export const Route = createFileRoute("/parcerias")({ head: () => ({ meta: [{ title: "Parcerias — Coleta Azul" }, { name: "description", content: "Gestão de organizações parceiras." }, { property: "og:title", content: "Parcerias — Coleta Azul" }, { property: "og:description", content: "Gestão de organizações parceiras." }] }), component: () => <CrudPage areaKey="parcerias" /> });
