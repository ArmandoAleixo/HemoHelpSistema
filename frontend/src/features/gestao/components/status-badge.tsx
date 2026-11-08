import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const positivo = ["Disponível", "Ativo", "Ativa", "Em rota"];
const alerta = ["Estoque crítico", "Em negociação", "Agendada", "Planejada"];

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap font-medium",
        positivo.includes(status)
          ? "border-success/20 bg-success-soft text-success"
          : alerta.includes(status)
            ? "border-warning/20 bg-warning-soft text-warning"
            : "border-muted bg-muted text-muted-foreground",
      )}
    >
      {status}
    </Badge>
  );
}
