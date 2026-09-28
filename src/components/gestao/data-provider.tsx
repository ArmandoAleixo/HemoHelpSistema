import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type AreaKey, type Registro } from "@/lib/gestao-data";
import * as api from "@/lib/api";

type DataContextValue = {
  dados: Record<AreaKey, Registro[]>;
  salvar: (area: AreaKey, registro: Registro) => Promise<void>;
  excluir: (area: AreaKey, id: string) => Promise<void>;
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
  parcerias: [],
  campanhas: [],
  doadores: [],
  agentes: [],
};

function combinarEstoqueComTiposPadrao(registros: Registro[]) {
  return tiposSanguineos.map((tipo) => {
    const registroSalvo = registros.find((registro) => registro.nome === tipo);
    return registroSalvo ?? dadosVazios.estoque.find((registro) => registro.nome === tipo)!;
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState(dadosVazios);

  useEffect(() => {
    let montado = true;
    const carregarDados = async () => {
      const entradas = await Promise.all(
        (Object.keys(dadosVazios) as AreaKey[]).map(async (area) => {
          try {
            const registros = await api.listar(area);
            return [
              area,
              area === "estoque" ? combinarEstoqueComTiposPadrao(registros) : registros,
            ] as const;
          } catch (error) {
            console.warn(`Nao foi possivel carregar ${area} da API.`, error);
            return [area, dadosVazios[area]] as const;
          }
        }),
      );

      if (montado) setDados(Object.fromEntries(entradas) as Record<AreaKey, Registro[]>);
    };

    void carregarDados();
    return () => {
      montado = false;
    };
  }, []);

  const salvar = async (area: AreaKey, registro: Registro) => {
    const registroSalvo = await api.salvar(area, registro);

    setDados((atual) => {
      const indiceExistente = atual[area].findIndex(
        (item) => item.id === registro.id || (area === "estoque" && item.nome === registro.nome),
      );
      const registros = [...atual[area]];
      if (indiceExistente >= 0) registros[indiceExistente] = registroSalvo;
      else registros.unshift(registroSalvo);
      return { ...atual, [area]: registros };
    });
  };

  const excluir = async (area: AreaKey, id: string) => {
    await api.excluir(area, id);

    setDados((atual) => ({
      ...atual,
      [area]: atual[area].filter((item) => item.id !== id),
    }));
  };
  return <DataContext.Provider value={{ dados, salvar, excluir }}>{children}</DataContext.Provider>;
}

export function useDados() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useDados deve ser usado dentro de DataProvider");
  return context;
}
