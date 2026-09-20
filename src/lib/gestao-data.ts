export type Registro = { id: string; [key: string]: string };
export type AreaKey = "estoque" | "unidades" | "locais" | "cidades" | "parcerias" | "campanhas";
export type Campo = { key: string; label: string; type?: string; options?: string[] };
export type Area = {
  key: AreaKey;
  nome: string;
  singular: string;
  descricao: string;
  campos: Campo[];
};

export const areas: Area[] = [
  { key: "estoque", nome: "Estoque", singular: "item", descricao: "Controle de materiais e disponibilidade", campos: [
    { key: "nome", label: "Item" }, { key: "categoria", label: "Categoria", options: ["Higiene", "Alimento", "Medicamento", "Vestuário"] },
    { key: "quantidade", label: "Quantidade", type: "number" }, { key: "unidade", label: "Unidade", options: ["un.", "kg", "caixas", "kits"] },
    { key: "status", label: "Status", options: ["Disponível", "Estoque baixo", "Indisponível"] },
  ]},
  { key: "unidades", nome: "Unidades móveis", singular: "unidade móvel", descricao: "Veículos e equipes em operação", campos: [
    { key: "nome", label: "Unidade" }, { key: "placa", label: "Placa" }, { key: "responsavel", label: "Responsável" },
    { key: "regiao", label: "Região" }, { key: "status", label: "Status", options: ["Em rota", "Disponível", "Manutenção"] },
  ]},
  { key: "locais", nome: "Locais de coleta", singular: "local de coleta", descricao: "Pontos fixos e temporários de atendimento", campos: [
    { key: "nome", label: "Local" }, { key: "cidade", label: "Cidade" }, { key: "endereco", label: "Endereço" },
    { key: "horario", label: "Horário" }, { key: "status", label: "Status", options: ["Ativo", "Pausado"] },
  ]},
  { key: "cidades", nome: "Cidades", singular: "cidade", descricao: "Municípios atendidos pelo programa", campos: [
    { key: "nome", label: "Cidade" }, { key: "uf", label: "UF" }, { key: "pontos", label: "Pontos", type: "number" },
    { key: "responsavel", label: "Coordenador" }, { key: "status", label: "Status", options: ["Ativa", "Planejada"] },
  ]},
  { key: "parcerias", nome: "Parcerias", singular: "parceria", descricao: "Organizações e apoiadores do projeto", campos: [
    { key: "nome", label: "Organização" }, { key: "tipo", label: "Tipo", options: ["Empresa", "ONG", "Governo", "Instituição"] },
    { key: "contato", label: "Contato" }, { key: "inicio", label: "Início", type: "date" }, { key: "status", label: "Status", options: ["Ativa", "Em negociação", "Encerrada"] },
  ]},
  { key: "campanhas", nome: "Campanhas", singular: "campanha", descricao: "Ações de arrecadação e mobilização", campos: [
    { key: "nome", label: "Campanha" }, { key: "cidade", label: "Cidade" }, { key: "meta", label: "Meta" },
    { key: "inicio", label: "Início", type: "date" }, { key: "status", label: "Status", options: ["Ativa", "Agendada", "Finalizada"] },
  ]},
];

export const dadosIniciais: Record<AreaKey, Registro[]> = {
  estoque: [
    { id: "1", nome: "Cestas básicas", categoria: "Alimento", quantidade: "248", unidade: "un.", status: "Disponível" },
    { id: "2", nome: "Kits de higiene", categoria: "Higiene", quantidade: "42", unidade: "kits", status: "Estoque baixo" },
    { id: "3", nome: "Cobertores", categoria: "Vestuário", quantidade: "120", unidade: "un.", status: "Disponível" },
    { id: "4", nome: "Leite em pó", categoria: "Alimento", quantidade: "0", unidade: "kg", status: "Indisponível" },
  ],
  unidades: [
    { id: "1", nome: "Unidade Azul 01", placa: "BRA2E19", responsavel: "Carlos Mendes", regiao: "Zona Norte", status: "Em rota" },
    { id: "2", nome: "Unidade Azul 02", placa: "FTR8J42", responsavel: "Marina Lima", regiao: "Centro", status: "Disponível" },
    { id: "3", nome: "Unidade Azul 03", placa: "DOP4C88", responsavel: "João Rocha", regiao: "Zona Sul", status: "Manutenção" },
  ],
  locais: [
    { id: "1", nome: "Centro Comunitário Esperança", cidade: "São Paulo", endereco: "Rua das Flores, 120", horario: "08h às 17h", status: "Ativo" },
    { id: "2", nome: "Ginásio Municipal", cidade: "Osasco", endereco: "Av. Brasil, 840", horario: "09h às 16h", status: "Ativo" },
    { id: "3", nome: "Escola Nova Geração", cidade: "Guarulhos", endereco: "Rua Norte, 55", horario: "10h às 15h", status: "Pausado" },
  ],
  cidades: [
    { id: "1", nome: "São Paulo", uf: "SP", pontos: "12", responsavel: "Renata Alves", status: "Ativa" },
    { id: "2", nome: "Osasco", uf: "SP", pontos: "5", responsavel: "Paulo Reis", status: "Ativa" },
    { id: "3", nome: "Guarulhos", uf: "SP", pontos: "7", responsavel: "Sofia Martins", status: "Ativa" },
    { id: "4", nome: "Campinas", uf: "SP", pontos: "0", responsavel: "André Costa", status: "Planejada" },
  ],
  parcerias: [
    { id: "1", nome: "Instituto Horizonte", tipo: "ONG", contato: "Ana Pereira", inicio: "2026-03-12", status: "Ativa" },
    { id: "2", nome: "Mercado Bom Dia", tipo: "Empresa", contato: "Rafael Nunes", inicio: "2026-05-20", status: "Ativa" },
    { id: "3", nome: "Fundação Viver", tipo: "Instituição", contato: "Clara Melo", inicio: "2026-09-01", status: "Em negociação" },
  ],
  campanhas: [
    { id: "1", nome: "Inverno Solidário", cidade: "São Paulo", meta: "1.000 cobertores", inicio: "2026-06-01", status: "Ativa" },
    { id: "2", nome: "Alimento para Todos", cidade: "Osasco", meta: "500 cestas", inicio: "2026-10-05", status: "Agendada" },
    { id: "3", nome: "Volta às Aulas", cidade: "Guarulhos", meta: "800 kits", inicio: "2026-01-10", status: "Finalizada" },
  ],
};
