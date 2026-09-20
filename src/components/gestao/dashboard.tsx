import { useId } from "react";
import { useDados } from "./data-provider";

const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function BolsaDeSangue({ percentual }: { percentual: number }) {
  const id = useId().replace(/:/g, "");
  const preenchimento = Math.min(100, Math.max(0, percentual));
  const altura = (76 * preenchimento) / 100;
  const topoLiquido = 113 - altura;

  return (
    <svg
      viewBox="0 0 96 128"
      className="h-24 w-[4.5rem] drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-20"
      role="img"
      aria-label={`${preenchimento.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do estoque`}
    >
      <defs>
        <clipPath id={`bolsa-${id}`} clipPathUnits="userSpaceOnUse">
          <path d="M25 37h46c5.5 0 10 4.5 10 10v54c0 8.8-7.2 16-16 16H31c-8.8 0-16-7.2-16-16V47c0-5.5 4.5-10 10-10Z" />
        </clipPath>
      </defs>
      <path
        d="M25 37h46c5.5 0 10 4.5 10 10v54c0 8.8-7.2 16-16 16H31c-8.8 0-16-7.2-16-16V47c0-5.5 4.5-10 10-10Z"
        className="fill-red-50 stroke-red-200"
        strokeWidth="3"
      />
      {preenchimento > 0 && (
        <g clipPath={`url(#bolsa-${id})`}>
          <rect x="0" y={topoLiquido} width="96" height={altura} className="fill-red-600 transition-all duration-500" />
          <path d={`M0 ${topoLiquido} Q24 ${topoLiquido - 6} 48 ${topoLiquido} T96 ${topoLiquido} V128 H0Z`} className="fill-red-500/80 transition-all duration-500" />
        </g>
      )}
      <path
        d="M25 37h46c5.5 0 10 4.5 10 10v54c0 8.8-7.2 16-16 16H31c-8.8 0-16-7.2-16-16V47c0-5.5 4.5-10 10-10Z"
        className="fill-transparent stroke-red-700/35"
        strokeWidth="3"
      />
      <path d="M28 54h40v24H28z" className="fill-white/80 stroke-red-200" strokeWidth="1.5" />
      <path d="M34 61h15M34 68h24" className="stroke-red-300" strokeLinecap="round" strokeWidth="2" />
      <path d="M48 112v11M42 123h12" className="stroke-red-400" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export function Dashboard() {
  const { dados } = useDados();
  const porcentagemPorTipo = tiposSanguineos.map((tipo) => ({
    tipo,
    porcentagem: dados.estoque
      .filter((item) => item["nome"] === tipo)
      .reduce((total, item) => total + Number(item["porcentagem"] ?? item["quantidade"] ?? 0), 0),
  }));

  return (
    <section className="animate-page-in">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Distribuição do estoque</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {porcentagemPorTipo.map(({ tipo, porcentagem }) => {
          const percentual = Math.min(100, Math.max(0, porcentagem));

          return (
            <div
              key={tipo}
              className="group relative min-h-[250px] min-w-0 overflow-hidden rounded-xl border bg-card p-3 shadow-panel transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-brand sm:min-h-[280px] sm:p-5 xl:min-h-[260px]"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-soft">
                <div className="h-full bg-primary transition-all" style={{ width: `${percentual}%` }} />
              </div>
              <div className="flex h-full flex-col justify-between gap-2">
                <div className="flex min-w-0 items-start justify-between gap-1">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary sm:size-10 sm:text-base">
                    {tipo}
                  </span>
                  <span className="truncate text-right text-[11px] font-medium text-muted-foreground sm:text-xs">
                    {percentual.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className="flex justify-center">
                  <BolsaDeSangue percentual={percentual} />
                </div>
                <div>
                  <p className="text-2xl font-semibold tracking-tight sm:text-4xl">
                    {percentual.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                    <span className="ml-0.5 text-lg text-primary">%</span>
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground sm:text-xs">do estoque total</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
