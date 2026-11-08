import { Link } from "@tanstack/react-router";
import { Droplets, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoadorAuth } from "@/features/auth/use-doador-auth";

export function DoadorHeader() {
  const { doador, sair } = useDoadorAuth();
  const primeiroNome = doador?.nome.trim().split(/\s+/)[0] ?? "Doador";

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
          <span className="mr-1 hidden text-sm text-muted-foreground md:inline">
            Olá, <strong className="font-semibold text-foreground">{primeiroNome}</strong>
          </span>

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
          <Button
            type="button"
            variant="ghost"
            onClick={sair}
            className="rounded-full px-4 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
