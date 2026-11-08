import { HeartPulse, ShieldCheck, Users } from "lucide-react";

export function SobreSection() {
  return (
    <section id="sobre" className="bg-card py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8">
        <div>
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-brand">
            <ShieldCheck className="size-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Uma rede feita para cuidar.
          </h2>
        </div>

        <div>
          <p className="text-xl leading-relaxed text-foreground">
            O HemoHelp aproxima doadores e hemocentros para que o sangue chegue a quem precisa, no
            momento certo.
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Somos um projeto de incentivo à doação voluntária, com informação clara, estoque
            atualizado e locais acessíveis. Porque quando a gente se une, a vida segue.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary">
              <Users className="size-4" /> Comunidade
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-4 py-2 text-sm font-semibold text-success">
              <HeartPulse className="size-4" /> Cuidado
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
