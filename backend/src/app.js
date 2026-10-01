import http from "node:http";
import { responder } from "./http/http.js";
import { rotearApi } from "./routes/api-router.js";

export function criarServidor() {
  return http.createServer((request, response) => {
    rotearApi(request, response).catch((error) => {
      console.error(error);
      responder(response, 500, { erro: error.message || "Erro interno do servidor." });
    });
  });
}
