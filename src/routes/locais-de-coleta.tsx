import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";
export const Route = createFileRoute("/locais-de-coleta")({ head: () => ({ meta: [{ title: "Locais de coleta — Coleta Azul" }, { name: "description", content: "Cadastro de pontos de coleta." }, { property: "og:title", content: "Locais de coleta — Coleta Azul" }, { property: "og:description", content: "Cadastro de pontos de coleta." }] }), component: () => <CrudPage areaKey="locais" /> });
