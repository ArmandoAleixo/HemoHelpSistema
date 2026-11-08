import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DoadorHeader } from "@/features/doador/components/doador-header";

export const Route = createFileRoute("/doador")({
  component: LayoutDoador,
});

function LayoutDoador() {
  return (
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
  );
}
