import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Droplets, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginDoador, salvarToken } from "@/features/auth/doador-auth-service";

export const Route = createFileRoute("/doador_/login")({
  head: () => ({
    meta: [
      { title: "Entrar - HemoHelp" },
      { name: "description", content: "Acesse sua área do doador no HemoHelp." },
    ],
  }),
  component: LoginDoador,
});

function LoginDoador() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    setEnviando(true);
    try {
      const { token } = await loginDoador({ email: email.trim(), senha });
      salvarToken(token);
      toast.success("Bem-vindo de volta!");
      await navigate({ to: "/doador", replace: true });
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Não foi possível entrar.");
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

      <Card className="w-full max-w-md border-border shadow-panel">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-extrabold tracking-tight">Área do doador</CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para acompanhar suas doações e campanhas.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={aoEnviar} className="space-y-5">
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

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="senha"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 bg-background pl-9"
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={enviando}
              className="h-11 w-full rounded-full shadow-brand"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link to="/doador/cadastro" className="font-semibold text-primary hover:underline">
                Cadastre-se
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
