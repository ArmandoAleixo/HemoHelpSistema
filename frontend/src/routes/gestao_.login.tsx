import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Droplets, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/use-auth";

export const Route = createFileRoute("/gestao_/login")({
  head: () => ({
    meta: [
      { title: "Acesso ao painel - HemoHelp Sistema" },
      { name: "description", content: "Acesso restrito ao painel de gestão do HemoHelp." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!email.trim() || !senha.trim()) return;

    entrar(email, senha);
    void navigate({ to: "/gestao", replace: true });
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
          <CardTitle className="text-2xl font-extrabold tracking-tight">Acesso ao painel</CardTitle>
          <CardDescription>
            Entre com suas credenciais para gerenciar estoque, campanhas e cadastros.
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
                  placeholder="voce@hemocentro.org.br"
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

            <Button type="submit" className="h-11 w-full rounded-full shadow-brand">
              Entrar no painel
            </Button>

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Acesso provisório: qualquer e-mail e senha preenchidos são aceitos até a integração
              com a autenticação da API.
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
