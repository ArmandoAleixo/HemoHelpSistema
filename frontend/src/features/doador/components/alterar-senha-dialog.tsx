import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { alterarSenhaDoador } from "@/features/auth/doador-auth-service";

type AlterarSenhaDialogProps = {
  aoFechar: () => void;
};

export function AlterarSenhaDialog({ aoFechar }: AlterarSenhaDialogProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (salvando) return;

    if (novaSenha.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não conferem.");
      return;
    }

    setSalvando(true);
    try {
      await alterarSenhaDoador({ senhaAtual, novaSenha });
      toast.success("Senha alterada com sucesso.");
      aoFechar();
    } catch (erro) {
      // Senha atual errada volta como 401 "Senha atual incorreta." — não desloga.
      toast.error(erro instanceof Error ? erro.message : "Não foi possível alterar a senha.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && aoFechar()}>
      <DialogContent>
        <form onSubmit={aoEnviar}>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>
              Confirme sua senha atual e escolha uma nova com no mínimo 6 caracteres.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="senha-atual">Senha atual</Label>
              <Input
                id="senha-atual"
                type="password"
                required
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(evento) => setSenhaAtual(evento.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nova-senha">Nova senha</Label>
              <Input
                id="nova-senha"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={novaSenha}
                onChange={(evento) => setNovaSenha(evento.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmar-nova-senha">Confirmar nova senha</Label>
              <Input
                id="confirmar-nova-senha"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Repita a nova senha"
                value={confirmarSenha}
                onChange={(evento) => setConfirmarSenha(evento.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Alterar senha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
