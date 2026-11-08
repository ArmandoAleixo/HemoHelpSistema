import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  buscarPerfilDoador,
  ErroApi,
  lerToken,
  removerToken,
  type Doador,
} from "./doador-auth-service";
import { DoadorAuthContext } from "./use-doador-auth";

// Carrega o perfil do doador logado e mantém o nome disponível para a área do doador.
export function DoadorAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [doador, setDoador] = useState<Doador | null>(null);
  const [carregando, setCarregando] = useState(true);

  const sair = useCallback(() => {
    removerToken();
    setDoador(null);
    void navigate({ to: "/doador/login", replace: true });
  }, [navigate]);

  // Mantém o contexto em sincronia depois de um PATCH no perfil.
  const atualizarDoador = useCallback((novo: Doador) => setDoador(novo), []);

  useEffect(() => {
    // Sem token não há o que carregar: volta para o login.
    if (!lerToken()) {
      void navigate({ to: "/doador/login", replace: true });
      return;
    }

    let ativo = true;

    buscarPerfilDoador()
      .then((perfil) => {
        if (ativo) setDoador(perfil);
      })
      .catch((erro: unknown) => {
        if (!ativo) return;

        // Token inválido ou expirado: limpa a sessão e manda de volta ao login.
        if (erro instanceof ErroApi && erro.status === 401) {
          removerToken();
          setDoador(null);
          void navigate({ to: "/doador/login", replace: true });
          return;
        }

        toast.error(erro instanceof Error ? erro.message : "Não foi possível carregar seu perfil.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [navigate]);

  const valor = useMemo(
    () => ({ doador, carregando, sair, atualizarDoador }),
    [doador, carregando, sair, atualizarDoador],
  );

  if (carregando) {
    return (
      <div className="landing flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando sua área...</p>
      </div>
    );
  }

  return <DoadorAuthContext.Provider value={valor}>{children}</DoadorAuthContext.Provider>;
}
