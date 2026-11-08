# Contrato da API — HemoHelpSistema

Documento de referência dos recursos já expostos pela API (`backend/src/config/resources.js` e
`backend/src/routes/api-router.js`). Todas as rotas abaixo já existem no código; este documento
apenas as descreve.

## Convenções

- Base: `http://localhost:${PORT}` (definido em `.env`).
- Formato: JSON (`Content-Type: application/json`).
- Identificador: `id` (string do `ObjectId` do MongoDB).
- Os campos listados como obrigatórios são validados no `POST`, `PUT` e `PATCH`.
- Campos de relacionamento, quando existirem, recebem o `id` do recurso referenciado.

---

## Health check

- Coleção: —
- **GET** `/api/health` — verifica a conexão com o MongoDB.

---

## Doadores

- Coleção: `DoadoresCCadastro`
- **GET** `/api/doadores` — lista os registros.
- **GET** `/api/doadores/:id` — busca um registro.
- **POST** `/api/doadores` — cria um registro.
- **PUT** `/api/doadores/:id` — atualiza um registro.
- **PATCH** `/api/doadores/:id` — atualiza parcialmente um registro.
- **DELETE** `/api/doadores/:id` — exclui um registro.

Campos obrigatórios:

| Campo      | Tipo   |
| ---------- | ------ |
| `nome`     | string |
| `cpf`      | string |
| `tipo`     | string |
| `telefone` | string |
| `status`   | string |

---

## Agentes de Saúde

- Coleção: `AgentesSaude`
- **GET** `/api/agentes` — lista os registros.
- **GET** `/api/agentes/:id` — busca um registro.
- **POST** `/api/agentes` — cria um registro.
- **PUT** `/api/agentes/:id` — atualiza um registro.
- **PATCH** `/api/agentes/:id` — atualiza parcialmente um registro.
- **DELETE** `/api/agentes/:id` — exclui um registro.

Campos obrigatórios:

| Campo      | Tipo   |
| ---------- | ------ |
| `nome`     | string |
| `registro` | string |
| `unidade`  | string |
| `funcao`   | string |
| `status`   | string |

Campos opcionais de relacionamento:

| Campo            | Referência       |
| ---------------- | ---------------- |
| `unidadeMovelId` | `UnidadesMoveis` |

---

## Campanhas

- Coleção: `Campanhas`
- **GET** `/api/campanhas` — lista os registros.
- **GET** `/api/campanhas/:id` — busca um registro.
- **POST** `/api/campanhas` — cria um registro.
- **PUT** `/api/campanhas/:id` — atualiza um registro.
- **PATCH** `/api/campanhas/:id` — atualiza parcialmente um registro.
- **DELETE** `/api/campanhas/:id` — exclui um registro.

Campos obrigatórios:

| Campo    | Tipo   |
| -------- | ------ |
| `nome`   | string |
| `meta`   | string |
| `inicio` | string |
| `status` | string |

Campos opcionais de relacionamento:

| Campo            | Referência       |
| ---------------- | ---------------- |
| `localColetaId`  | `LocaisColeta`   |
| `parceiroId`     | `Parceiros`      |
| `unidadeMovelId` | `UnidadesMoveis` |
| `responsavelId`  | `AgentesSaude`   |

---

## Estoque de Sangue

- Coleção: `EstoqueSangue`
- **GET** `/api/estoque` — lista os registros.
- **GET** `/api/estoque/:id` — busca um registro.
- **POST** `/api/estoque` — cria um registro.
- **PUT** `/api/estoque/:id` — atualiza um registro.
- **PATCH** `/api/estoque/:id` — atualiza parcialmente um registro.
- **DELETE** `/api/estoque/:id` — exclui um registro.

Campos obrigatórios:

| Campo         | Tipo   |
| ------------- | ------ |
| `nome`        | string |
| `porcentagem` | string |
| `unidade`     | string |
| `status`      | string |

---

## Locais de Coleta

- Coleção: `LocaisColeta`
- **GET** `/api/locais-coleta` — lista os registros.
- **GET** `/api/locais-coleta/:id` — busca um registro.
- **POST** `/api/locais-coleta` — cria um registro.
- **PUT** `/api/locais-coleta/:id` — atualiza um registro.
- **PATCH** `/api/locais-coleta/:id` — atualiza parcialmente um registro.
- **DELETE** `/api/locais-coleta/:id` — exclui um registro.

Campos obrigatórios:

| Campo      | Tipo   |
| ---------- | ------ |
| `nome`     | string |
| `endereco` | string |
| `horario`  | string |
| `status`   | string |

---

## Parcerias

- Coleção: `Parceiros`
- **GET** `/api/parcerias` — lista os registros.
- **GET** `/api/parcerias/:id` — busca um registro.
- **POST** `/api/parcerias` — cria um registro.
- **PUT** `/api/parcerias/:id` — atualiza um registro.
- **PATCH** `/api/parcerias/:id` — atualiza parcialmente um registro.
- **DELETE** `/api/parcerias/:id` — exclui um registro.

Campos obrigatórios:

| Campo     | Tipo   |
| --------- | ------ |
| `nome`    | string |
| `tipo`    | string |
| `contato` | string |
| `inicio`  | string |
| `status`  | string |

---

## Unidades Móveis

- Coleção: `UnidadesMoveis`
- **GET** `/api/unidades-moveis` — lista os registros.
- **GET** `/api/unidades-moveis/:id` — busca um registro.
- **POST** `/api/unidades-moveis` — cria um registro.
- **PUT** `/api/unidades-moveis/:id` — atualiza um registro.
- **PATCH** `/api/unidades-moveis/:id` — atualiza parcialmente um registro.
- **DELETE** `/api/unidades-moveis/:id` — exclui um registro.

Campos obrigatórios:

| Campo         | Tipo   |
| ------------- | ------ |
| `nome`        | string |
| `placa`       | string |
| `responsavel` | string |
| `bairro`      | string |
| `rua`         | string |
| `status`      | string |
