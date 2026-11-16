import { useEffect, useState, type ReactNode } from "react";
import { LoadingScreen } from "@/components/gestao/loading-screen";
import { Button } from "@/components/ui/button";
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
  campanhas: [],
  doadores: [],
  agentes: [],
  usuarios: [],
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
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let montado = true;

    async function carregarDados() {
      try {
        const entradas = await Promise.all(
          (Object.keys(dadosIniciais) as AreaKey[]).map(async (area) => {
            const registros = await api.listar(area);
            return [
              area,
              area === "estoque" ? combinarEstoqueComTiposPadrao(registros) : registros,
            ] as const;
          }),
        );

        if (montado) {
          setDados(Object.fromEntries(entradas) as Record<AreaKey, Registro[]>);
        }
      } catch (error) {
        if (montado) {
          console.warn("Nao foi possivel carregar os dados da API.", error);
          setErroCarregamento(true);
        }
      } finally {
        if (montado) setCarregando(false);
      }
    }

    void carregarDados();
    return () => {
      montado = false;
    };
  }, [tentativa]);

  if (carregando) return <LoadingScreen />;
  if (erroCarregamento) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div role="alert" className="max-w-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">Não foi possível carregar os dados</h1>
          <p className="text-sm text-muted-foreground">
            Verifique se o servidor do HemoHelp está em execução e tente novamente.
          </p>
          <Button
            onClick={() => {
              setErroCarregamento(false);
              setCarregando(true);
              setTentativa((atual) => atual + 1);
            }}
          >
            Tentar novamente
          </Button>
        </div>
      </main>
    );
  }

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
