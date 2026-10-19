import { Camera, Droplets, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAVEGACAO = [
  { href: "#campanhas", label: "Campanhas" },
  { href: "#locais", label: "Locais de coleta" },
  { href: "#criterios", label: "Critérios" },
];

export function Footer() {
  return (
    <footer className="bg-foreground py-12 text-background">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2.5 font-bold tracking-tight">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Droplets className="size-5" />
              </span>
              <span className="text-xl">
                Hemo<span className="text-primary">Help</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/65">
              Informação e acesso para uma corrente de solidariedade mais forte.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-bold">Navegue</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-background/65">
              {NAVEGACAO.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-background">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contato (dados de exemplo) */}
          <div>
            <h3 className="font-bold">Fale com a gente</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-background/65">
              <span className="flex items-center gap-2">
                <Phone className="size-4" /> (11) 4002-8922
              </span>
              <span>atendimento@hemohelp.org.br</span>
            </div>
          </div>

          {/* Redes sociais */}
          <div>
            <h3 className="font-bold">Siga o HemoHelp</h3>
            <Button
              variant="outline"
              size="icon"
              aria-label="Instagram do HemoHelp"
              className="mt-4 rounded-full border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <Camera />
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-background/15 pt-6 text-sm text-background/50 sm:flex-row">
          <span>© {new Date().getFullYear()} HemoHelp. Feito para a vida.</span>
          <strong className="text-background">Doe sangue, salve vidas.</strong>
        </div>
      </div>
    </footer>
  );
}
