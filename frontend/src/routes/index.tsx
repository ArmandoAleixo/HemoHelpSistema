import { createFileRoute, redirect } from "@tanstack/react-router";

// Este repositorio e apenas o painel administrativo. O site publico e a area do
// doador ficam no projeto hemocentro-site, entao a raiz leva direto ao login.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/gestao/login" });
  },
});
