import { createFileRoute } from "@tanstack/react-router";
import { useDoadorAuth } from "@/features/auth/use-doador-auth";
import { CampanhasAtivas } from "@/features/doador/components/campanhas-ativas";
import { LocaisColeta } from "@/features/doador/components/locais-coleta";
import { ProximaDoacao } from "@/features/doador/components/proxima-doacao";
import { campanhasAtivas, doadorComDadosReais, locaisColeta } from "@/features/doador/data/exemplo";

export const Route = createFileRoute("/doador/")({
  head: () => ({
    meta: [
      { title: "Área do doador - HemoHelp" },
      { name: "description", content: "Acompanhe suas doações, campanhas e locais de coleta." },
    ],
  }),
  component: AreaDoador,
});

function AreaDoador() {
  const { doador } = useDoadorAuth();
  const dadosDoador = doadorComDadosReais(doador);
  const primeiroNome = dadosDoador.nome.split(" ")[0] ?? dadosDoador.nome;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Área do doador</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Olá, {primeiroNome}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Acompanhe sua próxima doação, veja as campanhas ativas e encontre o ponto de coleta mais
          perto de você.
        </p>
      </div>

      <ProximaDoacao doador={dadosDoador} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <CampanhasAtivas campanhas={campanhasAtivas} />
        <LocaisColeta locais={locaisColeta} />
      </div>
    </div>
  );
}
