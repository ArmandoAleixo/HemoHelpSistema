import { Link, linkOptions } from "@tanstack/react-router";
import { Box, Building2, CalendarDays, Droplets, Handshake, LayoutDashboard, MapPin, Menu, Truck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const itens = linkOptions([
  { to: "/", label: "Visão geral", icon: LayoutDashboard },
  { to: "/estoque", label: "Estoque", icon: Box },
  { to: "/unidades-moveis", label: "Unidades móveis", icon: Truck },
  { to: "/locais-de-coleta", label: "Locais de coleta", icon: MapPin },
  { to: "/cidades", label: "Cidades", icon: Building2 },
  { to: "/parcerias", label: "Parcerias", icon: Handshake },
  { to: "/campanhas", label: "Campanhas", icon: CalendarDays },
] as const);

export function AppShell({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {aberto && <div className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setAberto(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0", aberto ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-18 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-3" onClick={() => setAberto(false)}>
            <span className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-brand"><Droplets className="size-5" /></span>
            <span><strong className="block text-base font-semibold text-sidebar-foreground">HemoHelp Sistema</strong><span className="block text-xs text-sidebar-muted">Gestão de estoque</span></span>
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
      </aside>
      <div className="lg:pl-64">
        <Button variant="default" size="icon" className="fixed bottom-5 right-5 z-20 shadow-brand lg:hidden" onClick={() => setAberto(true)} aria-label="Abrir menu"><Menu /></Button>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
