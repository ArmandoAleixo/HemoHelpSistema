// Relacionamentos opcionais entre documentos. Os campos armazenam ObjectId.
export const relacionamentos = Object.freeze([
  {
    colecao: "Campanhas",
    campo: "localColetaId",
    referencia: "LocaisColeta",
  },
  {
    colecao: "Campanhas",
    campo: "parceiroId",
    referencia: "Parceiros",
  },
  {
    colecao: "Campanhas",
    campo: "unidadeMovelId",
    referencia: "UnidadesMoveis",
  },
  {
    colecao: "Campanhas",
    campo: "responsavelId",
    referencia: "AgentesSaude",
  },
  {
    colecao: "AgentesSaude",
    campo: "unidadeMovelId",
    referencia: "UnidadesMoveis",
  },
]);
