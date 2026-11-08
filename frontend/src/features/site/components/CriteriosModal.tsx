import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CRITERIOS_COMPLETOS, FONTE_CRITERIOS } from "../data/criterios";

export function CriteriosModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          Ver todos os critérios
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Critérios para doação de sangue</DialogTitle>
          <DialogDescription>
            Confira os requisitos e impedimentos antes de ir ao hemocentro.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 rounded-lg bg-warning-soft p-3 text-sm text-warning">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Informações de exemplo, para fins acadêmicos. Os prazos e regras devem ser confirmados
            pelo hemocentro antes de doar.
          </p>
        </div>

        {CRITERIOS_COMPLETOS.map((grupo) => (
          <section key={grupo.titulo} className="space-y-2">
            <h3 className="font-semibold">{grupo.titulo}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {grupo.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <p className="text-xs text-muted-foreground">
          Fonte:{" "}
          <a href={FONTE_CRITERIOS.url} target="_blank" rel="noreferrer" className="underline">
            {FONTE_CRITERIOS.nome}
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
