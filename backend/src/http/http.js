const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type",
  "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
};

export function responder(response, status, body) {
  response.writeHead(status, headers);
  response.end(body === null ? undefined : JSON.stringify(body));
}

export async function lerBody(request) {
  const partes = [];
  for await (const parte of request) partes.push(parte);
  if (!partes.length) return {};

  try {
    return JSON.parse(Buffer.concat(partes).toString("utf8"));
  } catch {
    throw new Error("O corpo da requisicao precisa ser um JSON valido.");
  }
}
