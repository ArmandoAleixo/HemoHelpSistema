import { createFileRoute } from "@tanstack/react-router";
import { DadosDoador } from "@/features/doador/components/dados-doador";
import { doadorExemplo } from "@/features/doador/data/exemplo";

export const Route = createFileRoute("/doador/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil - HemoHelp" },
      { name: "description", content: "Seus dados de doador no HemoHelp." },
    ],
  }),
  component: PerfilDoador,
});

function PerfilDoador() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Meu perfil</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Seus dados</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Estas informações são somente leitura. Para corrigir algo, procure o hemocentro onde você
          fez sua última doação.
        </p>
      </div>

      <DadosDoador doador={doadorExemplo} />

      <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">E-mail cadastrado:</strong> {doadorExemplo.email}
        </p>
        <p className="mt-2">
          <strong className="text-foreground">Doações realizadas:</strong>{" "}
          {doadorExemplo.totalDoacoes}
        </p>
      </div>
    </div>
  );
}
