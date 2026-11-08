import {
  BadgeCheck,
  CalendarCheck2,
  ClipboardCheck,
  Droplets,
  IdCard,
  type LucideIcon,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarCpf } from "@/lib/formatadores";

const NAO_INFORMADO = "Não informado";
const SEM_DOACAO = "Nenhuma doação registrada";

type DadosDoadorProps = {
  nome: string;
  email: string;
  telefone: string | null;
  // Guardado só com números; a máscara é aplicada na exibição.
  cpf: string | null;
  tipoSanguineo: string;
  tipoSanguineoVerificado: boolean;
  status: string | null;
  // A API de perfil ainda não devolve histórico de doações.
  ultimaDoacao: string | null;
  totalDoacoes: number | null;
};

function Campo({
  titulo,
  valor,
  icone: Icone,
  selo,
}: {
  titulo: string;
  valor: string;
  icone: LucideIcon;
  selo?: string | undefined;
}) {
  return (
    <Card className="border-border shadow-panel">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Icone className="size-4 text-primary" />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-lg font-bold text-foreground">{valor}</p>
        {selo && <Badge variant="secondary">{selo}</Badge>}
      </CardContent>
    </Card>
  );
}

export function DadosDoador({
  nome,
  email,
  telefone,
  cpf,
  tipoSanguineo,
  tipoSanguineoVerificado,
  status,
  ultimaDoacao,
  totalDoacoes,
}: DadosDoadorProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Dados pessoais</h2>
          <p className="text-sm text-muted-foreground">Você pode editar estas informações.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Campo titulo="Nome" valor={nome} icone={UserRound} />
          <Campo titulo="E-mail" valor={email} icone={Mail} />
          <Campo titulo="Telefone" valor={telefone ?? NAO_INFORMADO} icone={Phone} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Dados de doador</h2>
          <p className="text-sm text-muted-foreground">
            Estes dados são confirmados pelo hemocentro.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo titulo="CPF" valor={cpf ? formatarCpf(cpf) : NAO_INFORMADO} icone={IdCard} />
          <Campo
            titulo="Tipo sanguíneo"
            valor={tipoSanguineo}
            icone={Droplets}
            selo={tipoSanguineoVerificado ? undefined : "Em verificação"}
          />
          <Campo titulo="Status" valor={status ?? "Em triagem"} icone={ClipboardCheck} />
          <Campo titulo="Última doação" valor={ultimaDoacao ?? SEM_DOACAO} icone={CalendarCheck2} />
          <Campo
            titulo="Doações realizadas"
            valor={totalDoacoes === null ? SEM_DOACAO : String(totalDoacoes)}
            icone={BadgeCheck}
          />
        </div>
      </section>
    </div>
  );
}
