import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/features/gestao/components/app-shell";
import { DataProvider } from "@/features/gestao/context/data-provider";
import { estaAutenticado } from "@/features/auth/use-auth";

export const Route = createFileRoute("/gestao")({
  beforeLoad: () => {
    if (!estaAutenticado()) {
      throw redirect({ to: "/gestao/login" });
    }
  },
  component: LayoutGestao,
});

function LayoutGestao() {
  const navigate = useNavigate();
  const [liberado, setLiberado] = useState(false);

  // Protege o acesso direto pela URL, quando o beforeLoad roda no servidor.
  // A checagem só acontece no cliente, depois da hidratação.
  useEffect(() => {
    if (!estaAutenticado()) {
      void navigate({ to: "/gestao/login", replace: true });
      return;
    }
    setLiberado(true);
  }, [navigate]);

  if (!liberado) return null;

  return (
    <DataProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </DataProvider>
  );
}
