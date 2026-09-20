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
  { key: "estoque", nome: "Estoque de sangue", singular: "bolsa", descricao: "Controle de bolsas por tipo sanguíneo e disponibilidade", campos: [
    { key: "nome", label: "Tipo sanguíneo", options: ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"] },
    { key: "categoria", label: "Hemocomponente", options: ["Concentrado de hemácias", "Plasma", "Plaquetas", "Crioprecipitado"] },
    { key: "quantidade", label: "Bolsas", type: "number" }, { key: "unidade", label: "Armazenamento", options: ["Câmara 01", "Câmara 02", "Freezer 01", "Agitador 01"] },
    { key: "status", label: "Status", options: ["Disponível", "Estoque crítico", "Indisponível"] },
  ]},
  { key: "unidades", nome: "Unidades móveis", singular: "unidade móvel", descricao: "Veículos de coleta e equipes em operação", campos: [
    { key: "nome", label: "Unidade" }, { key: "placa", label: "Placa" }, { key: "responsavel", label: "Responsável" },
    { key: "regiao", label: "Região" }, { key: "status", label: "Status", options: ["Em rota", "Disponível", "Manutenção"] },
  ]},
  { key: "locais", nome: "Locais de coleta", singular: "local de coleta", descricao: "Postos fixos e temporários para doação de sangue", campos: [
    { key: "nome", label: "Local" }, { key: "cidade", label: "Cidade" }, { key: "endereco", label: "Endereço" },
    { key: "horario", label: "Horário" }, { key: "status", label: "Status", options: ["Ativo", "Pausado"] },
  ]},
  { key: "cidades", nome: "Cidades", singular: "cidade", descricao: "Municípios atendidos pelo hemocentro", campos: [
    { key: "nome", label: "Cidade" }, { key: "uf", label: "UF" }, { key: "pontos", label: "Pontos", type: "number" },
    { key: "responsavel", label: "Coordenador" }, { key: "status", label: "Status", options: ["Ativa", "Planejada"] },
  ]},
  { key: "parcerias", nome: "Parcerias", singular: "parceria", descricao: "Instituições parceiras na mobilização de doadores", campos: [
    { key: "nome", label: "Organização" }, { key: "tipo", label: "Tipo", options: ["Empresa", "Hospital", "Governo", "Instituição de ensino"] },
    { key: "contato", label: "Contato" }, { key: "inicio", label: "Início", type: "date" }, { key: "status", label: "Status", options: ["Ativa", "Em negociação", "Encerrada"] },
  ]},
  { key: "campanhas", nome: "Campanhas", singular: "campanha", descricao: "Ações de doação de sangue e mobilização de doadores", campos: [
    { key: "nome", label: "Campanha" }, { key: "cidade", label: "Cidade" }, { key: "meta", label: "Meta" },
    { key: "inicio", label: "Início", type: "date" }, { key: "status", label: "Status", options: ["Ativa", "Agendada", "Finalizada"] },
  ]},
];

export const dadosIniciais: Record<AreaKey, Registro[]> = {
  estoque: [
    { id: "1", nome: "O+", categoria: "Concentrado de hemácias", quantidade: "86", unidade: "Câmara 01", status: "Disponível" },
    { id: "2", nome: "O−", categoria: "Concentrado de hemácias", quantidade: "12", unidade: "Câmara 01", status: "Estoque crítico" },
    { id: "3", nome: "A+", categoria: "Plasma", quantidade: "54", unidade: "Freezer 01", status: "Disponível" },
    { id: "4", nome: "AB−", categoria: "Plaquetas", quantidade: "0", unidade: "Agitador 01", status: "Indisponível" },
  ],
  unidades: [
    { id: "1", nome: "Hemomóvel 01", placa: "BRA2E19", responsavel: "Carlos Mendes", regiao: "Zona Norte", status: "Em rota" },
    { id: "2", nome: "Hemomóvel 02", placa: "FTR8J42", responsavel: "Marina Lima", regiao: "Centro", status: "Disponível" },
    { id: "3", nome: "Hemomóvel 03", placa: "DOP4C88", responsavel: "João Rocha", regiao: "Zona Sul", status: "Manutenção" },
  ],
  locais: [
    { id: "1", nome: "Hemocentro Central", cidade: "São Paulo", endereco: "Rua das Flores, 120", horario: "08h às 17h", status: "Ativo" },
    { id: "2", nome: "Posto Hospital Municipal", cidade: "Osasco", endereco: "Av. Brasil, 840", horario: "09h às 16h", status: "Ativo" },
    { id: "3", nome: "Posto Universitário", cidade: "Guarulhos", endereco: "Rua Norte, 55", horario: "10h às 15h", status: "Pausado" },
  ],
  cidades: [
    { id: "1", nome: "São Paulo", uf: "SP", pontos: "12", responsavel: "Renata Alves", status: "Ativa" },
    { id: "2", nome: "Osasco", uf: "SP", pontos: "5", responsavel: "Paulo Reis", status: "Ativa" },
    { id: "3", nome: "Guarulhos", uf: "SP", pontos: "7", responsavel: "Sofia Martins", status: "Ativa" },
    { id: "4", nome: "Campinas", uf: "SP", pontos: "0", responsavel: "André Costa", status: "Planejada" },
  ],
  parcerias: [
    { id: "1", nome: "Hospital Santa Clara", tipo: "Hospital", contato: "Ana Pereira", inicio: "2026-03-12", status: "Ativa" },
    { id: "2", nome: "Grupo Vida", tipo: "Empresa", contato: "Rafael Nunes", inicio: "2026-05-20", status: "Ativa" },
    { id: "3", nome: "Universidade Central", tipo: "Instituição de ensino", contato: "Clara Melo", inicio: "2026-09-01", status: "Em negociação" },
  ],
  campanhas: [
    { id: "1", nome: "Doe Sangue, Salve Vidas", cidade: "São Paulo", meta: "1.000 bolsas", inicio: "2026-06-01", status: "Ativa" },
    { id: "2", nome: "Semana do Doador", cidade: "Osasco", meta: "500 bolsas", inicio: "2026-10-05", status: "Agendada" },
    { id: "3", nome: "Universidade Solidária", cidade: "Guarulhos", meta: "800 doadores", inicio: "2026-01-10", status: "Finalizada" },
  ],
};
