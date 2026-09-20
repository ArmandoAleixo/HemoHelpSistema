import { createContext, useContext, useState, type ReactNode } from "react";
import { type AreaKey, type Registro } from "@/lib/gestao-data";

type DataContextValue = {
  dados: Record<AreaKey, Registro[]>;
  salvar: (area: AreaKey, registro: Registro) => void;
  excluir: (area: AreaKey, id: string) => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

const tiposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const dadosVazios: Record<AreaKey, Registro[]> = {
  estoque: tiposSanguineos.map((tipo) => ({
    id: `estoque-${tipo}`,
    nome: tipo,
    porcentagem: "0",
    unidade: "Banco de sangue",
    status: "Disponível",
  })),
  unidades: [],
  locais: [],
  cidades: [],
  parcerias: [],
  campanhas: [],
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState(dadosVazios);
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
