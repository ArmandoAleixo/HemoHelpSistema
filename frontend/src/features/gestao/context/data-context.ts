import { createContext } from "react";
import type { AreaKey, Registro } from "../domain/models";

export type DataContextValue = {
  dados: Record<AreaKey, Registro[]>;
  salvar: (area: AreaKey, registro: Registro) => Promise<void>;
  excluir: (area: AreaKey, id: string) => Promise<void>;
  // Busca novamente todas as areas na API, sem exibir a tela de carregamento.
  recarregar: () => Promise<void>;
};

export const DataContext = createContext<DataContextValue | undefined>(undefined);
