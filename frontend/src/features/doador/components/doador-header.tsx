import { Link } from "@tanstack/react-router";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DoadorHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link
          to="/doador"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand">
            <Droplets className="size-5" />
          </span>
          <span className="text-xl">
            Hemo<span className="text-primary">Help</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" className="rounded-full px-4">
            <Link
              to="/doador"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              Início
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full px-4">
            <Link to="/doador/perfil" activeProps={{ className: "bg-secondary text-foreground" }}>
              Meu perfil
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-border bg-card px-4">
            <Link to="/">Voltar ao site</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
