import { Check, Clock3, Info } from "lucide-react";

const PODE_DOAR = [
  "Ter entre 16 e 69 anos (menores com autorização)",
  "Pesar mais de 50 kg",
  "Estar descansado e bem alimentado",
  "Apresentar documento oficial com foto",
];

const IMPEDIMENTOS = [
  "Gripe ou febre nos últimos 15 dias",
  "Tatuagem ou piercing nos últimos 6 meses",
  "Gravidez ou amamentação",
  "Uso recente de alguns medicamentos",
];

export function CriteriosSection() {
  return (
    <section id="criterios" className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-primary">
            Antes de doar
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Quem pode doar sangue?
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Confira os requisitos básicos. Em caso de dúvida, nossa equipe está pronta para ajudar.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Quem pode doar */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-panel sm:p-8">
            <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <Check className="size-5" />
            </div>
            <h3 className="text-xl font-bold">Quem pode doar</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {PODE_DOAR.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Impedimentos temporários */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-panel sm:p-8">
            <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <Clock3 className="size-5" />
            </div>
            <h3 className="text-xl font-bold">Impedimentos temporários</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {IMPEDIMENTOS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0 text-warning" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
