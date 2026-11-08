import { Clock3, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dados de exemplo. Depois podem vir da API de locais de coleta.
const LOCAIS = [
  {
    nome: "Hemocentro Central",
    endereco: "Av. das Nações, 1200 · Centro",
    horario: "Seg a sex, das 7h às 17h",
  },
  {
    nome: "Unidade Zona Sul",
    endereco: "Rua das Flores, 84 · Jardim América",
    horario: "Seg a sáb, das 8h às 16h",
  },
  {
    nome: "Hospital da Cidade",
    endereco: "Rua Boa Esperança, 450 · Vila Nova",
    horario: "Ter a sex, das 8h às 15h",
  },
];

// Posição de cada marcador no mapa ilustrativo (mesma ordem de LOCAIS)
const MARCADORES = [
  { left: "25%", top: "28%" },
  { left: "58%", top: "52%" },
  { left: "72%", top: "24%" },
];

function linkDoMapa(endereco: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

export function LocaisSection() {
  return (
    <section id="locais" className="bg-primary-soft/45 py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-primary">
            Encontre um local
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Doe perto de você</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          {/* Lista de locais */}
          <div className="flex flex-col gap-3">
            {LOCAIS.map((local, index) => (
              <div
                key={local.nome}
                className={`rounded-2xl border bg-card p-5 shadow-panel ${
                  index === 0 ? "border-primary ring-1 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold">{local.nome}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{local.endereco}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-success">
                      <Clock3 className="size-3.5" /> {local.horario}
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full justify-between rounded-xl bg-secondary/60 text-primary"
                >
                  <a href={linkDoMapa(local.endereco)} target="_blank" rel="noreferrer">
                    Como chegar <Navigation />
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {/* Mapa ilustrativo (não é um mapa real) */}
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-border bg-secondary shadow-panel">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />

            {MARCADORES.map((posicao, index) => (
              <div
                key={index}
                className={`absolute flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-brand ring-8 ring-primary/15 ${
                  index === 0 ? "size-12" : "size-10"
                }`}
                style={posicao}
              >
                <MapPin className="size-5" />
              </div>
            ))}

            <div className="absolute bottom-5 left-5 rounded-xl bg-card/95 px-4 py-3 shadow-panel">
              <p className="text-sm font-bold">{LOCAIS.length} locais próximos</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Selecione uma unidade para ver detalhes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
