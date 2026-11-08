import { CalendarCheck2, Droplets, type LucideIcon, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DoadorExemplo } from "@/features/doador/data/exemplo";

function Campo({
  titulo,
  valor,
  icone: Icone,
}: {
  titulo: string;
  valor: string;
  icone: LucideIcon;
}) {
  return (
    <Card className="border-border shadow-panel">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Icone className="size-4 text-primary" />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold text-foreground">{valor}</p>
      </CardContent>
    </Card>
  );
}

export function DadosDoador({ doador }: { doador: DoadorExemplo }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Campo titulo="Nome" valor={doador.nome} icone={UserRound} />
      <Campo titulo="Tipo sanguíneo" valor={doador.tipoSanguineo} icone={Droplets} />
      <Campo titulo="Última doação" valor={doador.ultimaDoacao} icone={CalendarCheck2} />
    </div>
  );
}
