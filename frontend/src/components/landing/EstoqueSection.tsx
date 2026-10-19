// Dados de exemplo. Depois podem vir da API de estoque.
const ESTOQUE = [
  { tipo: "A+", nivel: "Estável", valor: 76, tom: "estavel" },
  { tipo: "A-", nivel: "Baixo", valor: 39, tom: "baixo" },
  { tipo: "B+", nivel: "Estável", valor: 68, tom: "estavel" },
  { tipo: "B-", nivel: "Crítico", valor: 18, tom: "critico" },
  { tipo: "AB+", nivel: "Estável", valor: 82, tom: "estavel" },
  { tipo: "AB-", nivel: "Baixo", valor: 32, tom: "baixo" },
  { tipo: "O+", nivel: "Baixo", valor: 44, tom: "baixo" },
  { tipo: "O-", nivel: "Crítico", valor: 13, tom: "critico" },
] as const;

type Tom = (typeof ESTOQUE)[number]["tom"];

// Classes de cor para cada nível do estoque
const CORES: Record<Tom, { ponto: string; barra: string; selo: string }> = {
  estavel: {
    ponto: "bg-success",
    barra: "bg-success",
    selo: "bg-success-soft text-success",
  },
  baixo: {
    ponto: "bg-warning",
    barra: "bg-warning",
    selo: "bg-warning-soft text-warning",
  },
  critico: {
    ponto: "bg-destructive",
    barra: "bg-destructive",
    selo: "bg-destructive/10 text-destructive",
  },
};

export function EstoqueSection() {
  return (
    <section id="estoque" className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-primary">
              Transparência
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Como está o estoque?
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Acompanhe os níveis e ajude a manter todos os tipos disponíveis.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {ESTOQUE.map((item) => {
            const cores = CORES[item.tom];

            return (
              <div
                key={item.tipo}
                className="rounded-2xl border border-border bg-background p-4 shadow-panel transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-extrabold">{item.tipo}</span>
                  <span className={`mt-1 size-2 rounded-full ${cores.ponto}`} />
                </div>

                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${cores.barra}`}
                    style={{ width: `${item.valor}%` }}
                  />
                </div>

                <div className="mt-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${cores.selo}`}>
                    {item.nivel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
