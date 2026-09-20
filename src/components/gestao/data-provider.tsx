import { createContext, useContext, useState, type ReactNode } from "react";
import { dadosIniciais, type AreaKey, type Registro } from "@/lib/gestao-data";

type DataContextValue = {
  dados: Record<AreaKey, Registro[]>;
  salvar: (area: AreaKey, registro: Registro) => void;
  excluir: (area: AreaKey, id: string) => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState(dadosIniciais);
  const salvar = (area: AreaKey, registro: Registro) => setDados((atual) => ({
    ...atual,
    [area]: atual[area].some((item) => item.id === registro.id)
      ? atual[area].map((item) => item.id === registro.id ? registro : item)
      : [registro, ...atual[area]],
  }));
  const excluir = (area: AreaKey, id: string) => setDados((atual) => ({
    ...atual, [area]: atual[area].filter((item) => item.id !== id),
  }));
  return <DataContext.Provider value={{ dados, salvar, excluir }}>{children}</DataContext.Provider>;
}

export function useDados() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useDados deve ser usado dentro de DataProvider");
  return context;
}
