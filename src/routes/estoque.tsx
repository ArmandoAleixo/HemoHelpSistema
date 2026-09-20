import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/gestao/crud-page";
export const Route = createFileRoute("/estoque")({ head: () => ({ meta: [{ title: "Estoque — Coleta Azul" }, { name: "description", content: "Controle de estoque da Coleta Azul." }, { property: "og:title", content: "Estoque — Coleta Azul" }, { property: "og:description", content: "Controle de estoque da Coleta Azul." }] }), component: () => <CrudPage areaKey="estoque" /> });
