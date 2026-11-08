// Conteúdo de EXEMPLO, baseado no site do Ministério da Saúde.
// Deve ser validado pelo hemocentro antes de publicar.
export const FONTE_CRITERIOS = {
  nome: "Ministério da Saúde",
  url: "https://www.gov.br/saude/pt-br/composicao/saes/doacao-de-sangue",
};

export const CRITERIOS_PRINCIPAIS = [
  "Ter entre 16 e 69 anos (menores de 18 com autorização do responsável)",
  "Pesar no mínimo 50 kg",
  "Ter dormido pelo menos 6 horas nas últimas 24 horas",
  "Estar alimentado e evitar alimentos gordurosos antes da doação",
  "Apresentar documento oficial com foto",
];

export const CRITERIOS_COMPLETOS = [
  {
    titulo: "Requisitos",
    itens: [
      "Ter entre 16 e 69 anos. Menores de 18 anos precisam do consentimento formal do responsável legal.",
      "Pessoas entre 60 e 69 anos só podem doar se já tiverem doado antes dos 60.",
      "Apresentar documento com foto emitido por órgão oficial. Documentos digitais com foto são aceitos.",
      "Pesar no mínimo 50 kg.",
      "Ter dormido pelo menos 6 horas nas últimas 24 horas.",
      "Estar alimentado. Evitar alimentos gordurosos nas 3 horas antes da doação. Após o almoço, aguardar 2 horas.",
    ],
  },
  {
    titulo: "Impedimentos temporários",
    itens: [
      "Gripe, resfriado ou febre recentes",
      "Gravidez, pós-parto ou amamentação",
      "Consumo de bebida alcoólica nas horas anteriores",
      "Tatuagem, piercing ou maquiagem definitiva recentes",
      "Uso de alguns medicamentos",
    ],
  },
  {
    titulo: "Impedimentos definitivos",
    itens: [
      "Hepatite B ou C",
      "Infecção por HIV",
      "Doença de Chagas",
      "Malária já tratada ou em tratamento",
      "Uso de drogas injetáveis ilícitas",
    ],
  },
];

export const IMPEDIMENTOS_PRINCIPAIS = [
  "Gripe, resfriado ou febre recentes",
  "Tatuagem, piercing ou maquiagem definitiva recentes",
  "Gravidez, pós-parto ou amamentação",
  "Uso recente de alguns medicamentos",
];
