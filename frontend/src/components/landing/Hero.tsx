import { ArrowRight, ChevronDown, Droplets, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
        {/* Coluna da esquerda: textos e botões */}
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-success-soft px-3.5 py-2 text-xs font-bold text-success">
            <span className="size-2 rounded-full bg-success" /> Estoque atualizado hoje, às 8h
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.04] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-[4.5rem]">
            Seu gesto pode <span className="text-primary">salvar vidas.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Doar sangue é rápido, seguro e essencial. Encontre um local perto de você e faça parte
            dessa corrente do bem.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6 shadow-brand" id="doar">
              <a href="#locais">
                Ver locais de doação <ArrowRight />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-border bg-card px-6"
            >
              <a href="#criterios">
                Posso doar? <ChevronDown />
              </a>
            </Button>
          </div>
        </div>

        {/* Coluna da direita: cartão azul */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-primary-soft/70 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-primary shadow-brand">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 30% 20%, white 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="relative flex min-h-[390px] flex-col justify-between p-7 sm:min-h-[460px] sm:p-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-bold text-primary-foreground">
                  Doe hoje
                </span>
                <HeartPulse className="text-primary-foreground/70" />
              </div>
              <div>
                <div className="mb-5 flex size-28 items-center justify-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/25 sm:size-36">
                  <Droplets className="size-14 text-primary-foreground sm:size-20" />
                </div>
                <p className="max-w-xs text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-4xl">
                  Uma doação pode ajudar até três pessoas.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-primary-foreground/20 pt-5 text-sm text-primary-foreground/75">
                <span>HemoHelp</span>
                <span>Juntos pela vida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
