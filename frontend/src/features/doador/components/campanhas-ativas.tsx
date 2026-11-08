import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CampanhaDoador } from "@/features/doador/data/exemplo";

export function CampanhasAtivas({ campanhas }: { campanhas: CampanhaDoador[] }) {
  return (
    <Card className="border-border shadow-panel">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Campanhas ativas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {campanhas.map((campanha) => (
          <article
            key={campanha.id}
            className="rounded-xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/30"
          >
            <h3 className="font-bold">{campanha.titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{campanha.descricao}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-primary" />
                {campanha.periodo}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                {campanha.local}
              </span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
