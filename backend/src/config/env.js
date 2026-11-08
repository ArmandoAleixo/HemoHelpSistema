import "dotenv/config";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI nao foi definida no arquivo .env");
}

export const env = Object.freeze({
  mongoUri,
  mongoDatabase: process.env.MONGODB_DB ?? "hemohelp",
  port: Number(process.env.PORT ?? 3001),
  // O segredo do JWT e conferido apenas nas rotas de autenticacao,
  // para a API continuar subindo mesmo sem a variavel definida.
  jwtSecret: process.env.JWT_SECRET ?? "",
});
