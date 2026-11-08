import { useCallback, useEffect, useState, type ReactNode } from "react";
import { LoadingScreen } from "@/features/gestao/components/loading-screen";
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
  const [carregando, setCarregando] = useState(true);

  const buscarDados = useCallback(async () => {
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

    return Object.fromEntries(entradas) as Record<AreaKey, Registro[]>;
  }, []);

  useEffect(() => {
    let montado = true;

    void buscarDados().then((novosDados) => {
      if (!montado) return;
      setDados(novosDados);
      setCarregando(false);
    });

    return () => {
      montado = false;
    };
  }, [buscarDados]);

  // Recarrega quando o usuario volta para esta aba: assim um doador cadastrado
  // pelo site (em outra aba) aparece na tabela sem precisar recarregar a pagina.
  useEffect(() => {
    function atualizarSeVisivel() {
      if (document.visibilityState === "visible") void buscarDados().then(setDados);
    }

    window.addEventListener("focus", atualizarSeVisivel);
    document.addEventListener("visibilitychange", atualizarSeVisivel);

    return () => {
      window.removeEventListener("focus", atualizarSeVisivel);
      document.removeEventListener("visibilitychange", atualizarSeVisivel);
    };
  }, [buscarDados]);

  const recarregar = useCallback(async () => {
    setDados(await buscarDados());
  }, [buscarDados]);

  if (carregando) return <LoadingScreen />;

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

  return (
    <DataContext.Provider value={{ dados, salvar, excluir, recarregar }}>
      {children}
    </DataContext.Provider>
  );
}
