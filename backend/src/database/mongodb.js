import { MongoClient } from "mongodb";
import { env } from "../config/env.js";
import { recursos } from "../config/resources.js";
import { relacionamentos } from "../config/relationships.js";

const client = new MongoClient(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
let databasePromise;

async function garantirColecoes(database) {
  const colecoesExistentes = new Set(
    (await database.listCollections({}, { nameOnly: true }).toArray()).map(
      (colecao) => colecao.name,
    ),
  );

  await Promise.all(
    recursos
      .map(({ colecao }) => colecao)
      .filter((nome, indice, nomes) => nomes.indexOf(nome) === indice)
      .filter((nome) => !colecoesExistentes.has(nome))
      .map(async (nome) => {
        try {
          await database.createCollection(nome);
        } catch (error) {
          // Outro processo pode ter criado a colecao entre a listagem e a criacao.
          if (error.code !== 48) throw error;
        }
      }),
  );
}

async function garantirIndicesRelacionamentos(database) {
  await Promise.all(
    relacionamentos.map(({ colecao, campo }) =>
      database.collection(colecao).createIndex({ [campo]: 1 }),
    ),
  );
}

// Indices unicos. O filtro parcial ignora documentos antigos que ainda nao tem o campo.
const indicesUnicos = Object.freeze([
  {
    colecao: "DoadoresCCadastro",
    campo: "email",
    opcoes: { unique: true, partialFilterExpression: { email: { $type: "string" } } },
  },
  {
    colecao: "DoadoresCCadastro",
    campo: "cpf",
    opcoes: { unique: true, partialFilterExpression: { cpf: { $type: "string" } } },
  },
]);

async function garantirIndicesUnicos(database) {
  await Promise.all(
    indicesUnicos.map(({ colecao, campo, opcoes }) =>
      database.collection(colecao).createIndex({ [campo]: 1 }, opcoes),
    ),
  );
}

export async function conectarBanco() {
  if (!databasePromise) {
    databasePromise = client
      .connect()
      .then(() => client.db(env.mongoDatabase))
      .then(async (database) => {
        await garantirColecoes(database);
        await garantirIndicesRelacionamentos(database);
        await garantirIndicesUnicos(database);
        return database;
      });
  }

  try {
    return await databasePromise;
  } catch (error) {
    databasePromise = undefined;
    throw new Error(
      `Nao foi possivel conectar ao MongoDB. Verifique MONGODB_URI, MONGODB_DB e o IP liberado no Atlas. Detalhe: ${error.message}`,
    );
  }
}

export async function obterColecao(nome) {
  return (await conectarBanco()).collection(nome);
}

export async function fecharBanco() {
  await client.close();
  databasePromise = undefined;
}
