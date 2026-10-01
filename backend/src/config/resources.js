export const recursos = Object.freeze([
  {
    caminho: "/api/doadores",
    colecao: "DoadoresCCadastro",
    camposObrigatorios: ["nome", "cpf", "tipo", "telefone", "status"],
  },
  {
    caminho: "/api/agentes",
    colecao: "AgentesSaude",
    camposObrigatorios: ["nome", "registro", "unidade", "funcao", "status"],
  },
  {
    caminho: "/api/campanhas",
    colecao: "Campanhas",
    camposObrigatorios: ["nome", "meta", "inicio", "status"],
  },
  {
    caminho: "/api/estoque",
    colecao: "EstoqueSangue",
    camposObrigatorios: ["nome", "porcentagem", "unidade", "status"],
  },
  {
    caminho: "/api/locais-coleta",
    colecao: "LocaisColeta",
    camposObrigatorios: ["nome", "endereco", "horario", "status"],
  },
  {
    caminho: "/api/parcerias",
    colecao: "Parceiros",
    camposObrigatorios: ["nome", "tipo", "contato", "inicio", "status"],
  },
  {
    caminho: "/api/unidades-moveis",
    colecao: "UnidadesMoveis",
    camposObrigatorios: ["nome", "placa", "responsavel", "bairro", "rua", "status"],
  },
]);
