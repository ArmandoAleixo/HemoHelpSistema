import { Link, useRouterState } from "@tanstack/react-router";
import { Box, Building2, CalendarDays, ChevronDown, Handshake, LayoutDashboard, MapPin, Menu, PackageOpen, Search, Truck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const itens = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard },
  { to: "/estoque", label: "Estoque", icon: Box },
  { to: "/unidades-moveis", label: "Unidades móveis", icon: Truck },
  { to: "/locais-de-coleta", label: "Locais de coleta", icon: MapPin },
  { to: "/cidades", label: "Cidades", icon: Building2 },
  { to: "/parcerias", label: "Parcerias", icon: Handshake },
  { to: "/campanhas", label: "Campanhas", icon: CalendarDays },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const atual = itens.find((item) => item.to === pathname)?.label ?? "Visão geral";
  return (
    <div className="min-h-screen bg-background text-foreground">
      {aberto && <div className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setAberto(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0", aberto ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-18 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-3" onClick={() => setAberto(false)}>
            <span className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-brand"><PackageOpen className="size-5" /></span>
            <span><strong className="block text-base font-semibold text-sidebar-foreground">Coleta Azul</strong><span className="block text-xs text-sidebar-muted">Gestão integrada</span></span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setAberto(false)} aria-label="Fechar menu"><X /></Button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Navegação principal">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-muted">Menu principal</p>
          {itens.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }} onClick={() => setAberto(false)} className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-primary data-[status=active]:shadow-nav">
              <Icon className="size-[18px]" /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <button className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-sidebar-accent" type="button">
            <span className="flex size-9 items-center justify-center rounded-full bg-avatar text-sm font-semibold text-primary">AM</span>
            <span className="min-w-0 flex-1"><strong className="block truncate text-sm font-medium">Ana Martins</strong><span className="block text-xs text-sidebar-muted">Administradora</span></span><ChevronDown className="size-4 text-sidebar-muted" />
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-18 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-7">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setAberto(true)} aria-label="Abrir menu"><Menu /></Button>
          <div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">Painel administrativo</p><h1 className="truncate text-base font-semibold">{atual}</h1></div>
          <div className="hidden w-72 items-center gap-2 rounded-md border bg-muted/40 px-3 sm:flex"><Search className="size-4 text-muted-foreground"/><input className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Buscar no sistema..." /></div>
          <span className="flex size-9 items-center justify-center rounded-full bg-avatar text-sm font-semibold text-primary sm:hidden">AM</span>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
