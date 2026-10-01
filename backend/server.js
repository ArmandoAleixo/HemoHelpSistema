import { fileURLToPath } from "node:url";
import { criarServidor } from "./src/app.js";
import { env } from "./src/config/env.js";

const server = criarServidor();

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === fileURLToPath(`file://${process.argv[1]}`)
) {
  server.listen(env.port, () => console.log(`API HemoHelp em http://localhost:${env.port}`));
}

export { server };
