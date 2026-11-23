import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ClipboardList, Droplets, Eye, EyeOff, LogOut } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/gestao/app-shell";
import { LoadingScreen } from "@/components/gestao/loading-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FundoMedico from "@/images/Fundo Médico Minimalista com Ondas Vermelhas.png";
import { DataProvider } from "@/features/gestao/context/data-provider";
import {
  entrar,
  limparChaveAba,
  obterChaveAba,
  obterSessao,
  sair,
  sairAoFechar,
  type UsuarioSessao,
} from "@/features/gestao/services/gestao-api";

type Destino = "hemohelp" | "pedidos" | null;
const CHAVE_DESTINO = "hemohelp-destino";

function Brand() {
  return (
    <div className="flex items-center gap-2.5 text-foreground">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Droplets className="size-5" />
      </span>
      <span className="text-base font-semibold tracking-tight">HemoHelp</span>
    </div>
  );
}

function LoginPage({
  onSubmit,
  carregando,
  erro,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  carregando: boolean;
  erro: string;
}) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  return (
    <main
      className="relative isolate flex min-h-[100svh] items-center justify-center bg-cover bg-center px-5 py-10"
      style={{ backgroundImage: `url("${FundoMedico}")` }}
    >
      <div className="absolute inset-0 -z-10 bg-background/20" aria-hidden="true" />
      <div className="w-full max-w-[400px]">
        <Brand />
        <div className="mt-10 rounded-xl border border-white/70 bg-card/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-muted-foreground">Informe suas credenciais para continuar.</p>
          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nomeUsuario">Usuário</Label>
              <Input
                id="nomeUsuario"
                name="nomeUsuario"
                autoComplete="username"
                className="h-11"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={senhaVisivel ? "text" : "password"}
                  autoComplete="current-password"
                  className="h-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel((atual) => !atual)}
                  className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                >
                  {senhaVisivel ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            {erro && (
              <p role="alert" className="text-sm text-destructive">
                {erro}
              </p>
            )}
            <Button type="submit" disabled={carregando} className="h-11 w-full">
              {carregando ? "Entrando..." : "Entrar"}
              <ArrowRight />
            </Button>
          </form>
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Acesso reservado à equipe HemoHelp.
        </p>
      </div>
    </main>
  );
}

function AreaHeader({
  usuario,
  onSair,
  onVoltar,
  carregando,
}: {
  usuario: UsuarioSessao;
  onSair: () => void;
  onVoltar?: () => void;
  carregando: boolean;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b py-5">
      <Brand />
      <div className="flex items-center gap-3">
        <span className="hidden max-w-40 truncate text-sm text-muted-foreground sm:block">
          {usuario.nomeUsuario}
        </span>
        {onVoltar ? (
          <Button variant="ghost" onClick={onVoltar} disabled={carregando}>
            <ArrowLeft /> Voltar
          </Button>
        ) : (
          <Button variant="ghost" onClick={onSair} disabled={carregando}>
            <LogOut /> Sair
          </Button>
        )}
      </div>
    </header>
  );
}

function ChoosePage({
  usuario,
  selecionar,
  onSair,
  carregando,
  erro,
}: {
  usuario: UsuarioSessao;
  selecionar: (destino: Exclude<Destino, null>) => void;
  onSair: () => void;
  carregando: boolean;
  erro: string;
}) {
  const areas = [
    {
      key: "hemohelp" as const,
      nome: "HemoHelp",
      descricao: "Painel de gestão do sistema",
      icon: Droplets,
    },
    { key: "pedidos" as const, nome: "Pedidos", descricao: "Área de pedidos", icon: ClipboardList },
  ];
  return (
    <main className="min-h-[100svh] bg-background px-5">
      <div className="mx-auto max-w-4xl">
        <AreaHeader usuario={usuario} onSair={onSair} onVoltar={onSair} carregando={carregando} />
        <section className="py-16 sm:py-24">
          <p className="text-sm text-muted-foreground">Olá, {usuario.nomeUsuario}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Escolha uma área
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Selecione onde deseja continuar.</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {areas.map(({ key, nome, descricao, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => selecionar(key)}
                className="group flex min-h-40 flex-col justify-between rounded-xl border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary-soft/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="size-6 text-primary" strokeWidth={1.7} />
                <span className="flex items-end justify-between gap-4">
                  <span>
                    <strong className="block text-xl font-semibold">{nome}</strong>
                    <span className="mt-1 block text-sm text-muted-foreground">{descricao}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </span>
              </button>
            ))}
          </div>
          {erro && (
            <p role="alert" className="mt-5 text-sm text-destructive">
              {erro}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function PedidosPage({
  usuario,
  onVoltar,
  onSair,
  carregando,
  erro,
}: {
  usuario: UsuarioSessao;
  onVoltar: () => void;
  onSair: () => void;
  carregando: boolean;
  erro: string;
}) {
  return (
    <main className="min-h-[100svh] bg-background px-5">
      <div className="mx-auto max-w-4xl">
        <AreaHeader usuario={usuario} onSair={onSair} carregando={carregando} />
        <div className="py-12">
          <Button variant="ghost" onClick={onVoltar} className="-ml-3 text-muted-foreground">
            <ArrowLeft /> Voltar às áreas
          </Button>
          <h1 className="mt-10 text-3xl font-semibold tracking-tight">Pedidos</h1>
          {erro && (
            <p role="alert" className="mt-5 text-sm text-destructive">
              {erro}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export function AccessGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [destino, setDestino] = useState<Destino>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    void obterSessao()
      .then(({ usuario: sessao }) => {
        if (!ativo) return;
        setUsuario(sessao);
        const salvo = sessionStorage.getItem(CHAVE_DESTINO);
        if (salvo === "hemohelp" || salvo === "pedidos") setDestino(salvo);
      })
      .catch(() => {
        if (ativo) {
          sessionStorage.removeItem(CHAVE_DESTINO);
          limparChaveAba();
        }
      })
      .finally(() => {
        if (ativo) setVerificando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    const sessaoExpirada = () => {
      sessionStorage.removeItem(CHAVE_DESTINO);
      limparChaveAba();
      setDestino(null);
      setUsuario(null);
      setErro("Sua sessão expirou. Entre novamente.");
    };
    window.addEventListener("hemohelp:sessao-expirada", sessaoExpirada);
    return () => window.removeEventListener("hemohelp:sessao-expirada", sessaoExpirada);
  }, []);

  useEffect(() => {
    if (!usuario) return;
    const aoSairDaPagina = () => {
      sessionStorage.removeItem(CHAVE_DESTINO);
      sairAoFechar();
    };
    const aoRestaurarPagina = () => {
      if (obterChaveAba()) return;
      setDestino(null);
      setUsuario(null);
      setErro("Sessão encerrada. Entre novamente.");
    };
    window.addEventListener("pagehide", aoSairDaPagina);
    window.addEventListener("pageshow", aoRestaurarPagina);
    return () => {
      window.removeEventListener("pagehide", aoSairDaPagina);
      window.removeEventListener("pageshow", aoRestaurarPagina);
    };
  }, [usuario]);

  async function fazerLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setCarregando(true);
    setErro("");
    try {
      const resposta = await entrar(
        String(form.get("nomeUsuario") ?? ""),
        String(form.get("senha") ?? ""),
      );
      sessionStorage.removeItem(CHAVE_DESTINO);
      setDestino(null);
      setUsuario(resposta.usuario);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setCarregando(false);
    }
  }

  function selecionar(escolha: Exclude<Destino, null>) {
    sessionStorage.setItem(CHAVE_DESTINO, escolha);
    setDestino(escolha);
    if (escolha === "hemohelp") void router.navigate({ to: "/" });
  }

  function voltarSelecao() {
    sessionStorage.removeItem(CHAVE_DESTINO);
    setDestino(null);
  }

  async function fazerLogout() {
    setCarregando(true);
    setErro("");
    try {
      await sair();
      sessionStorage.removeItem(CHAVE_DESTINO);
      setDestino(null);
      setUsuario(null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível sair.");
      toast.error(error instanceof Error ? error.message : "Não foi possível sair.");
    } finally {
      setCarregando(false);
    }
  }

  if (verificando) return <LoadingScreen />;
  if (!usuario) return <LoginPage onSubmit={fazerLogin} carregando={carregando} erro={erro} />;
  if (destino === "hemohelp")
    return (
      <DataProvider>
        <AppShell nomeUsuario={usuario.nomeUsuario} onVoltar={voltarSelecao} onSair={fazerLogout}>
          {children}
        </AppShell>
      </DataProvider>
    );
  if (destino === "pedidos")
    return (
      <PedidosPage
        usuario={usuario}
        onVoltar={voltarSelecao}
        onSair={fazerLogout}
        carregando={carregando}
        erro={erro}
      />
    );
  return (
    <ChoosePage
      usuario={usuario}
      selecionar={selecionar}
      onSair={fazerLogout}
      carregando={carregando}
      erro={erro}
    />
  );
}
