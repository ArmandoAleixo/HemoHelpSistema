import { useEffect, useState, type ReactNode } from "react";
import { TIPOS_SANGUINEOS } from "../domain/estoque";
import type { AreaKey, Registro } from "../domain/models";
import * as api from "../services/gestao-api";
import { DataContext } from "./data-context";

const dadosIniciais: Record<AreaKey, Registro[]> = {
  estoque: TIPOS_SANGUINEOS.map((tipo) => ({
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
  return TIPOS_SANGUINEOS.map((tipo) => {
    const registroSalvo = registros.find((registro) => registro["nome"] === tipo);
    return registroSalvo ?? dadosIniciais.estoque.find((registro) => registro["nome"] === tipo)!;
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState(dadosIniciais);

  useEffect(() => {
    let montado = true;

    async function carregarDados() {
      const entradas = await Promise.all(
        (Object.keys(dadosIniciais) as AreaKey[]).map(async (area) => {
          try {
            const registros = await api.listar(area);
            return [
              area,
              area === "estoque" ? combinarEstoqueComTiposPadrao(registros) : registros,
            ] as const;
          } catch (error) {
            console.warn(`Nao foi possivel carregar ${area} da API.`, error);
            return [area, dadosIniciais[area]] as const;
          }
        }),
      );

      if (montado) setDados(Object.fromEntries(entradas) as Record<AreaKey, Registro[]>);
    }

    void carregarDados();
    return () => {
      montado = false;
    };
  }, []);

  async function salvar(area: AreaKey, registro: Registro) {
    const registroSalvo = await api.salvar(area, registro);

    setDados((atual) => {
      const indiceExistente = atual[area].findIndex(
        (item) =>
          item.id === registro.id || (area === "estoque" && item["nome"] === registro["nome"]),
      );
      const registros = [...atual[area]];
      if (indiceExistente >= 0) registros[indiceExistente] = registroSalvo;
      else registros.unshift(registroSalvo);
      return { ...atual, [area]: registros };
    });
  }

  async function excluir(area: AreaKey, id: string) {
    await api.excluir(area, id);
    setDados((atual) => ({
      ...atual,
      [area]: atual[area].filter((item) => item.id !== id),
    }));
  }

  return <DataContext.Provider value={{ dados, salvar, excluir }}>{children}</DataContext.Provider>;
}
