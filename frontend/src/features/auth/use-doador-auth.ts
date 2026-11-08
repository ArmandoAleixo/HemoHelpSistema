// Contexto da sessão do doador. O provedor carrega o perfil e expõe o doador
// para o cabeçalho e para as páginas da área do doador.
import { createContext, useContext } from "react";
import type { Doador } from "./doador-auth-service";

export type ContextoDoador = {
  doador: Doador | null;
  carregando: boolean;
  sair: () => void;
  // Usado depois de editar o perfil, para o cabeçalho refletir o novo nome.
  atualizarDoador: (doador: Doador) => void;
};

// O valor inicial nulo só existe para o hook avisar quando é usado fora do provedor.
export const DoadorAuthContext = createContext<ContextoDoador | null>(null);

export function useDoadorAuth() {
  const contexto = useContext(DoadorAuthContext);
  if (!contexto) {
    throw new Error("useDoadorAuth precisa ser usado dentro de DoadorAuthProvider.");
  }
  return contexto;
}
