import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";
export const Route = createFileRoute("/unidades-moveis")({ head: () => ({ meta: [{ title: "Unidades móveis — Coleta Azul" }, { name: "description", content: "Gestão de unidades móveis e equipes." }, { property: "og:title", content: "Unidades móveis — Coleta Azul" }, { property: "og:description", content: "Gestão de unidades móveis e equipes." }] }), component: () => <CrudPage areaKey="unidades" /> });
