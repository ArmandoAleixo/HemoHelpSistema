import { MongoClient } from "mongodb";
import { env } from "../config/env.js";

const client = new MongoClient(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
let databasePromise;

export async function conectarBanco() {
  if (!databasePromise) {
    databasePromise = client.connect().then(() => client.db(env.mongoDatabase));
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
