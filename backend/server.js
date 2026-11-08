import { fileURLToPath } from "node:url";
import { criarServidor } from "./src/app.js";
import { env } from "./src/config/env.js";
import { conectarBanco } from "./src/database/mongodb.js";

const server = criarServidor();

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === fileURLToPath(`file://${process.argv[1]}`)
) {
  server.listen(env.port, () => console.log(`API HemoHelp em http://localhost:${env.port}`));

  // Conecta assim que a API sobe, para criar as colecoes e os indices
  // (incluindo o indice unico de email dos doadores) antes da primeira requisicao.
  conectarBanco()
    .then(() => console.log("MongoDB conectado e indices garantidos."))
    .catch((error) => console.error(error.message));
}

export { server };
