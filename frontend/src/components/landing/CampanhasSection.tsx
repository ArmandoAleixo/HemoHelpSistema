import { ArrowRight } from "lucide-react";

// Dados de exemplo. Depois podem vir da API de campanhas.
const CAMPANHAS = [
  {
    imagem: "/landing/campaign-people.png",
    data: "12 a 16 de agosto",
    titulo: "Uma doação, três histórias",
    descricao: "Compartilhe esperança com quem precisa.",
  },
  {
    imagem: "/landing/campaign-community.png",
    data: "24 de agosto",
    titulo: "Sábado de salvar vidas",
    descricao: "Doe no hemocentro mais perto de você.",
  },
  {
    imagem: "/landing/campaign-mobile.png",
    data: "03 a 05 de setembro",
    titulo: "HemoHelp na sua cidade",
    descricao: "A unidade móvel está chegando.",
  },
];

export function CampanhasSection() {
  return (
    <section id="campanhas" className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-primary">
              Participe
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Campanhas em destaque
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {CAMPANHAS.map((campanha) => (
            <article
              key={campanha.titulo}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-panel"
            >
              <div className="relative aspect-[1.6] overflow-hidden">
                <img
                  src={campanha.imagem}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold text-foreground">
                  {campanha.data}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold">{campanha.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{campanha.descricao}</p>
                <a
                  href="#locais"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
                >
                  Saiba mais <ArrowRight className="size-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
