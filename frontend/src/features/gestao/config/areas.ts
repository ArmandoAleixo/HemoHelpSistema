import { TIPOS_SANGUINEOS } from "../domain/estoque";
import type { Area } from "../domain/models";

export const areas: Area[] = [
  {
    key: "estoque",
    nome: "Estoque de sangue",
    singular: "bolsa",
    descricao: "Controle do estoque por tipo sanguíneo e porcentagem disponível",
    campos: [
      { key: "nome", label: "Tipo sanguíneo", options: TIPOS_SANGUINEOS },
      { key: "porcentagem", label: "Porcentagem", type: "number" },
      { key: "unidade", label: "Armazenamento" },
      {
        key: "status",
        label: "Status",
        options: ["Disponível", "Estoque crítico", "Indisponível"],
      },
    ],
  },
  {
    key: "unidades",
    nome: "Unidades móveis",
    singular: "unidade móvel",
    descricao: "Veículos de coleta e equipes em operação",
    campos: [
      { key: "nome", label: "Unidade" },
      { key: "placa", label: "Placa" },
      { key: "responsavel", label: "Responsável" },
      { key: "bairro", label: "Bairro" },
      { key: "rua", label: "Rua" },
      { key: "status", label: "Status", options: ["Em rota", "Disponível", "Manutenção"] },
    ],
  },
  {
    key: "locais",
    nome: "Locais de coleta",
    singular: "local de coleta",
    descricao: "Postos fixos e temporários para doação de sangue",
    campos: [
      { key: "nome", label: "Local" },
      { key: "endereco", label: "Endereço" },
      { key: "horario", label: "Horário" },
      { key: "status", label: "Status", options: ["Ativo", "Pausado"] },
    ],
  },
  {
    key: "parcerias",
    nome: "Parcerias",
    singular: "parceria",
    descricao: "Instituições parceiras na mobilização de doadores",
    campos: [
      { key: "nome", label: "Organização" },
      {
        key: "tipo",
        label: "Tipo",
        options: ["Empresa", "Hospital", "Governo", "Instituição de ensino"],
      },
      { key: "contato", label: "Contato" },
      { key: "inicio", label: "Início", type: "date" },
      { key: "status", label: "Status", options: ["Ativa", "Em negociação", "Encerrada"] },
    ],
  },
  {
    key: "campanhas",
    nome: "Campanhas",
    singular: "campanha",
    descricao: "Ações de doação de sangue e mobilização de doadores",
    campos: [
      { key: "nome", label: "Campanha" },
      { key: "meta", label: "Meta" },
      { key: "inicio", label: "Início", type: "date" },
      { key: "status", label: "Status", options: ["Ativa", "Agendada", "Finalizada"] },
    ],
  },
  {
    key: "doadores",
    nome: "Doadores",
    singular: "doador",
    descricao: "Cadastro de doadores, tipos sanguíneos e situação para novas doações",
    campos: [
      { key: "nome", label: "Nome" },
      { key: "cpf", label: "CPF" },
      { key: "tipo", label: "Tipo sanguíneo", options: TIPOS_SANGUINEOS },
      { key: "telefone", label: "Telefone" },
      { key: "status", label: "Status", options: ["Apto", "Em triagem", "Inapto temporário"] },
    ],
  },
  {
    key: "agentes",
    nome: "Agentes de saúde",
    singular: "agente de saúde",
    descricao: "Cadastro de profissionais responsáveis por coletas, campanhas e atendimento",
    campos: [
      { key: "nome", label: "Nome" },
      { key: "registro", label: "Registro" },
      { key: "unidade", label: "Unidade" },
      {
        key: "funcao",
        label: "Função",
        options: ["Enfermagem", "Medicina", "Técnico de coleta", "Coordenação"],
      },
      { key: "status", label: "Status", options: ["Ativo", "Em escala", "Afastado"] },
    ],
  },
];
