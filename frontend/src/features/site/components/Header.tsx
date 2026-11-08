import { Link } from "@tanstack/react-router";
import { ArrowRight, Droplets, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#campanhas", label: "Campanhas" },
  { href: "#locais", label: "Locais" },
  { href: "#criterios", label: "Critérios" },
  { href: "#estoque", label: "Estoque" },
  { href: "#sobre", label: "Sobre" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 lg:px-8">
        <a
          href="#inicio"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand">
            <Droplets />
          </span>
          <span className="text-xl">
            Hemo<span className="text-primary">Help</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground lg:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden rounded-full px-5 shadow-brand sm:flex">
            <Link to="/doador">
              Área do doador <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="hidden rounded-full border-border bg-card px-5 md:flex"
          >
            <Link to="/gestao/login">Acesso hemocentro</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-border px-5 py-5 text-sm font-semibold lg:hidden">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <Button asChild className="rounded-full">
              <Link to="/doador" onClick={() => setOpen(false)}>
                Área do doador
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-border bg-card">
              <Link to="/gestao/login" onClick={() => setOpen(false)}>
                Acesso hemocentro
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
