import { Clock3, MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LocalColeta } from "@/features/doador/data/exemplo";

function linkDoMapa(endereco: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

export function LocaisColeta({ locais }: { locais: LocalColeta[] }) {
  return (
    <Card className="border-border shadow-panel">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Locais de coleta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {locais.map((local) => (
          <article key={local.id} className="rounded-xl border border-border bg-secondary/40 p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{local.nome}</h3>
                  {local.exemplo && (
                    <Badge
                      variant="outline"
                      className="border-warning/40 bg-warning-soft text-warning"
                    >
                      A confirmar
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  {local.tipo}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{local.endereco}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                  <Clock3 className="size-3.5" />
                  {local.horario}
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mt-3 w-full justify-between rounded-xl bg-background text-primary"
            >
              <a href={linkDoMapa(local.endereco)} target="_blank" rel="noreferrer">
                Como chegar
                <Navigation />
              </a>
            </Button>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
