import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DoadorAuthProvider } from "@/features/auth/doador-auth-provider";
import { lerToken } from "@/features/auth/doador-auth-service";
import { DoadorHeader } from "@/features/doador/components/doador-header";

export const Route = createFileRoute("/doador")({
  beforeLoad: () => {
    // No servidor não existe localStorage. A verificação real acontece no cliente,
    // logo após a hidratação, para não redirecionar quem já está logado.
    if (typeof window !== "undefined" && !lerToken()) {
      throw redirect({ to: "/doador/login" });
    }
  },
  component: LayoutDoador,
});

function LayoutDoador() {
  const navigate = useNavigate();
  const [liberado, setLiberado] = useState(false);

  // Protege o acesso direto pela URL, quando o beforeLoad roda no servidor
  // (lá não existe localStorage). A checagem real acontece após a hidratação.
  useEffect(() => {
    if (!lerToken()) {
      void navigate({ to: "/doador/login", replace: true });
      return;
    }

    setLiberado(true);
  }, [navigate]);

  if (!liberado) return null;

  return (
    <DoadorAuthProvider>
      <div className="landing flex min-h-screen flex-col bg-background">
        <DoadorHeader />

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-border bg-card py-6">
          <div className="mx-auto max-w-5xl px-5 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} HemoHelp. Doe sangue, salve vidas.
          </div>
        </footer>
      </div>
    </DoadorAuthProvider>
  );
}
