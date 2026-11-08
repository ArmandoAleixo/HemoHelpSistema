import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDoadorAuth } from "@/features/auth/use-doador-auth";
import { AlterarSenhaDialog } from "@/features/doador/components/alterar-senha-dialog";
import { DadosDoador } from "@/features/doador/components/dados-doador";
import { EditarDadosDialog } from "@/features/doador/components/editar-dados-dialog";

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
  const { doador } = useDoadorAuth();
  const [editando, setEditando] = useState(false);
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Meu perfil</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Seus dados</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Mantenha seus dados de contato atualizados. As informações de doação são confirmadas
            pelo hemocentro.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setEditando(true)} disabled={!doador}>
            <Pencil />
            Editar dados
          </Button>
          <Button variant="outline" onClick={() => setAlterandoSenha(true)}>
            <KeyRound />
            Alterar senha
          </Button>
        </div>
      </div>

      {/* A API de perfil não devolve histórico de doações, então não há como exibir uma data. */}
      <DadosDoador
        nome={doador?.nome ?? "Doador"}
        email={doador?.email ?? "Não informado"}
        telefone={doador?.telefone ?? null}
        cpf={doador?.cpf ?? null}
        tipoSanguineo={doador?.tipoSanguineo ?? "A confirmar"}
        tipoSanguineoVerificado={doador?.tipoSanguineoVerificado === true}
        status={doador?.status ?? null}
        ultimaDoacao={null}
        totalDoacoes={null}
      />

      {editando && doador && (
        <EditarDadosDialog doador={doador} aoFechar={() => setEditando(false)} />
      )}
      {alterandoSenha && <AlterarSenhaDialog aoFechar={() => setAlterandoSenha(false)} />}
    </div>
  );
}
