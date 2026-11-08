import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Droplets, IdCard, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cadastrarDoador } from "@/features/auth/doador-auth-service";
import {
  apenasDigitos,
  cpfValido,
  formatarCpf,
  formatarTelefone,
  telefoneValido,
} from "@/lib/formatadores";

const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const Route = createFileRoute("/doador_/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta - HemoHelp" },
      { name: "description", content: "Cadastre-se como doador no HemoHelp." },
    ],
  }),
  component: CadastroDoador,
});

function CadastroDoador() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    if (!tipoSanguineo) {
      toast.error("Selecione o seu tipo sanguíneo.");
      return;
    }

    if (!cpfValido(cpf)) {
      toast.error("CPF inválido.");
      return;
    }

    if (telefone && !telefoneValido(telefone)) {
      toast.error("Telefone inválido. Informe 10 ou 11 dígitos.");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não conferem.");
      return;
    }

    setEnviando(true);
    try {
      await cadastrarDoador({
        nome: nome.trim(),
        email: email.trim(),
        cpf: apenasDigitos(cpf),
        // O telefone é opcional: só envia quando preenchido.
        ...(telefone ? { telefone: apenasDigitos(telefone) } : {}),
        tipoSanguineo,
        senha,
      });
      toast.success("Cadastro realizado! Faça login para continuar.");
      await navigate({ to: "/doador/login" });
    } catch (erro) {
      // Mensagens da API (e-mail ou CPF já cadastrado, CPF inválido etc.) aparecem no toast.
      toast.error(erro instanceof Error ? erro.message : "Não foi possível concluir o cadastro.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="landing flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-5 py-12">
      <Link
        to="/"
        className="mb-8 flex items-center gap-2.5 font-bold tracking-tight text-foreground"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand">
          <Droplets />
        </span>
        <span className="text-xl">
          Hemo<span className="text-primary">Help</span>
        </span>
      </Link>

      <Card className="w-full max-w-lg border-border shadow-panel">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Criar conta</CardTitle>
          <CardDescription>
            Preencha seus dados para acompanhar doações, campanhas e locais de coleta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={aoEnviar} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="nome"
                  required
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  className="h-11 bg-background pl-9"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="voce@email.com"
                  className="h-11 bg-background pl-9"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cpf"
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="h-11 bg-background pl-9"
                    value={cpf}
                    onChange={(evento) => setCpf(formatarCpf(evento.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="telefone"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="h-11 bg-background pl-9"
                    value={telefone}
                    onChange={(evento) => setTelefone(formatarTelefone(evento.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoSanguineo">Tipo sanguíneo</Label>
              <Select value={tipoSanguineo} onValueChange={setTipoSanguineo}>
                <SelectTrigger id="tipoSanguineo" className="h-11 bg-background">
                  <SelectValue placeholder="Selecione seu tipo sanguíneo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_SANGUINEOS.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Seu tipo sanguíneo ficará em verificação até a primeira doação, quando o hemocentro
                confirma no exame.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    className="h-11 bg-background pl-9"
                    value={senha}
                    onChange={(evento) => setSenha(evento.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmarSenha"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Repita a senha"
                    className="h-11 bg-background pl-9"
                    value={confirmarSenha}
                    onChange={(evento) => setConfirmarSenha(evento.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={enviando}
              className="h-11 w-full rounded-full shadow-brand"
            >
              {enviando ? "Cadastrando..." : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/doador/login" className="font-semibold text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <Button asChild variant="ghost" className="mt-4 rounded-full">
        <Link to="/">Voltar ao site</Link>
      </Button>
    </main>
  );
}
