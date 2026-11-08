// Dados de exemplo para apresentação ao hemocentro; serão substituídos pela API.

export type CampanhaDoador = {
  id: string;
  titulo: string;
  periodo: string;
  local: string;
  descricao: string;
};

export type LocalColeta = {
  id: string;
  nome: string;
  endereco: string;
  horario: string;
  tipo: string;
  exemplo?: boolean;
};

export type DoadorExemplo = {
  nome: string;
  email: string;
  tipoSanguineo: string;
  ultimaDoacao: string;
  proximaDoacaoPossivel: string;
  totalDoacoes: number;
};

export const doadorExemplo: DoadorExemplo = {
  nome: "Marina Alves",
  email: "marina.alves@email.com",
  tipoSanguineo: "O-",
  ultimaDoacao: "12 de junho de 2026",
  proximaDoacaoPossivel: "12 de setembro de 2026",
  totalDoacoes: 7,
};

export const campanhasAtivas: CampanhaDoador[] = [
  {
    id: "campanha-1",
    titulo: "Uma doação, três histórias",
    periodo: "12 a 16 de agosto",
    local: "Hemocentro de Campina Grande",
    descricao: "Compartilhe esperança com quem precisa.",
  },
  {
    id: "campanha-2",
    titulo: "Sábado de salvar vidas",
    periodo: "24 de agosto",
    local: "Hospital HELP",
    descricao: "Doe no hemocentro mais perto de você.",
  },
  {
    id: "campanha-3",
    titulo: "HemoHelp na sua cidade",
    periodo: "03 a 05 de setembro",
    local: "Policlínica das Malvinas",
    descricao: "A unidade móvel está chegando ao seu bairro.",
  },
];

export const locaisColeta: LocalColeta[] = [
  {
    id: "local-1",
    nome: "Hemocentro de Campina Grande",
    endereco: "R. Profa. Eutécia Vital Ribeiro, s/n · Campina Grande - PB",
    horario: "Seg a sex, a partir das 7h",
    tipo: "Hemocentro",
  },
  {
    id: "local-2",
    nome: "Hospital HELP",
    endereco: "R. Heronides da Costa Cirne, 250 · Serrotão · Campina Grande - PB",
    horario: "Horário a confirmar",
    tipo: "Ponto de campanha",
    exemplo: true,
  },
  {
    id: "local-3",
    nome: "Policlínica das Malvinas",
    endereco: "Av. Plínio Lemos · Malvinas · Campina Grande - PB",
    horario: "Horário a confirmar",
    tipo: "Unidade móvel",
    exemplo: true,
  },
];
