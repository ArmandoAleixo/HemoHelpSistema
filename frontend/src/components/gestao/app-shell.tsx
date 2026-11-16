import { Link, linkOptions, useRouter, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  Box,
  CalendarDays,
  Droplets,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Truck,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const itens = linkOptions([
  { to: "/", label: "Visão geral", icon: LayoutDashboard },
  { to: "/estoque", label: "Estoque", icon: Box },
  { to: "/unidades-moveis", label: "Unidades móveis", icon: Truck },
  { to: "/locais-de-coleta", label: "Locais de coleta", icon: MapPin },
  { to: "/campanhas", label: "Campanhas", icon: CalendarDays },
  { to: "/cadastros", label: "Cadastros", icon: UserRoundPlus },
] as const);

export function AppShell({
  children,
  nomeUsuario,
  onVoltar,
  onSair,
}: {
  children: ReactNode;
  nomeUsuario?: string;
  onVoltar?: () => void;
  onSair?: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const voltar = () => {
    if (pathname === "/") onVoltar?.();
    else void router.navigate({ to: "/" });
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      {aberto && (
        <div className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setAberto(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0",
          aberto ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-18 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-3" onClick={() => setAberto(false)}>
            <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Droplets className="size-5" />
            </span>
            <span>
              <strong className="block text-[17px] font-bold tracking-tight text-sidebar-foreground">
                HemoHelp
              </strong>
              <span className="block text-xs text-sidebar-muted">Sistema de gestão</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
          >
            <X />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Navegação principal">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-muted">
            Menu principal
          </p>
          {itens.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              onClick={() => setAberto(false)}
              className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-primary"
            >
              <Icon className="size-[18px]" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        {(nomeUsuario || onSair) && (
          <div className="space-y-1 border-t border-sidebar-border px-3 py-4">
            {nomeUsuario && (
              <p className="mb-3 truncate px-3 text-xs text-sidebar-muted">{nomeUsuario}</p>
            )}
            {onSair && (
              <button
                type="button"
                onClick={onSair}
                className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="size-[18px]" /> Sair
              </button>
            )}
          </div>
        )}
      </aside>
      <div className="lg:pl-64">
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-5 right-5 z-20 lg:hidden"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu"
        >
          <Menu />
        </Button>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-7">
          {(pathname !== "/" || onVoltar) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={voltar}
              className="-ml-2 mb-4 text-muted-foreground"
            >
              <ArrowLeft /> {pathname === "/" ? "Voltar às áreas" : "Voltar ao painel"}
            </Button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
