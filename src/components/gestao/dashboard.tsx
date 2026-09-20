import { ArrowRight, Box, CalendarDays, Handshake, MapPin, PackageOpen, TrendingUp, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { areas } from "@/lib/gestao-data";
import { useDados } from "./data-provider";
import { StatusBadge } from "./status-badge";

const links = { estoque: "/estoque", unidades: "/unidades-moveis", locais: "/locais-de-coleta", cidades: "/cidades", parcerias: "/parcerias", campanhas: "/campanhas" } as const;
const cards = [
  { key: "estoque", label: "Itens em estoque", icon: Box, detalhe: "2 itens precisam de atenção" },
  { key: "unidades", label: "Unidades móveis", icon: Truck, detalhe: "1 unidade em rota" },
  { key: "locais", label: "Locais de coleta", icon: MapPin, detalhe: "2 pontos ativos" },
  { key: "campanhas", label: "Campanhas", icon: CalendarDays, detalhe: "1 campanha em andamento" },
] as const;

export function Dashboard() {
  const { dados } = useDados();
  return <section className="animate-page-in">
    <div className="mb-7"><p className="mb-1 text-sm font-medium text-primary">Domingo, 20 de setembro</p><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Olá, Ana. Aqui está o resumo.</h2><p className="mt-2 text-sm text-muted-foreground">Acompanhe os principais números da operação.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ key, label, icon: Icon, detalhe }) => <Link key={key} to={links[key]} className="group rounded-lg border bg-card p-5 shadow-panel transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-brand"><div className="mb-5 flex items-start justify-between"><span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary"><Icon className="size-5" /></span><TrendingUp className="size-4 text-success" /></div><p className="text-3xl font-semibold">{key === "estoque" ? dados.estoque.reduce((total, item) => total + Number(item.quantidade), 0) : dados[key].length}</p><p className="mt-1 text-sm font-medium">{label}</p><p className="mt-3 text-xs text-muted-foreground">{detalhe}</p></Link>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="overflow-hidden rounded-lg border bg-card shadow-panel"><div className="flex items-center justify-between border-b px-5 py-4"><div><h3 className="font-semibold">Campanhas recentes</h3><p className="mt-0.5 text-xs text-muted-foreground">Ações em destaque</p></div><Link to="/campanhas" className="flex items-center gap-1 text-sm font-medium text-primary">Ver todas <ArrowRight className="size-4"/></Link></div><div className="divide-y">{dados.campanhas.map((item) => <div key={item.id} className="flex items-center gap-4 px-5 py-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary"><CalendarDays className="size-5"/></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.nome}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.cidade} · Meta: {item.meta}</p></div><StatusBadge status={item.status}/></div>)}</div>
      <div className="rounded-lg border bg-card shadow-panel"><div className="border-b px-5 py-4"><h3 className="font-semibold">Acesso rápido</h3><p className="mt-0.5 text-xs text-muted-foreground">Principais cadastros</p></div><div className="grid grid-cols-2 gap-px bg-border">{areas.slice(2).map((area) => { const Icon = area.key === "locais" ? MapPin : area.key === "cidades" ? PackageOpen : area.key === "parcerias" ? Handshake : CalendarDays; return <Link key={area.key} to={links[area.key]} className="flex min-h-28 flex-col justify-between bg-card p-4 transition-colors hover:bg-primary-soft"><Icon className="size-5 text-primary"/><div><p className="text-lg font-semibold">{dados[area.key].length}</p><p className="text-xs text-muted-foreground">{area.nome}</p></div></Link>})}</div></div>
    </div>
  </section>;
}
