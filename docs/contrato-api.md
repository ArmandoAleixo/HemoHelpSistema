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

## Autenticação do doador (UC06)

- Coleção: `DoadoresCCadastro`
- O doador é identificado por `email` (único, obrigatório para este fluxo).
- `senhaHash` é gravado com bcrypt e **nunca** aparece em nenhuma resposta da API.
- O login devolve um JWT assinado com `JWT_SECRET` (do `.env`), com validade de **1 dia**.
- Rotas protegidas usam o cabeçalho `Authorization: Bearer <token>`.
- No MongoDB o tipo sanguíneo fica no campo `tipo` (compatível com o painel de gestão); nas
  rotas de autenticação ele é exposto como `tipoSanguineo`.

Campos do doador:

| Campo           | Obrigatório        | Observação                          |
| --------------- | ------------------ | ----------------------------------- |
| `nome`          | sim (cadastro)     | string                              |
| `email`         | sim (cadastro)     | único, sem diferenciar maiúsculas   |
| `tipoSanguineo` | sim (cadastro)     | string, gravado em `tipo`           |
| `senha`         | sim (cadastro)     | mínimo de 6 caracteres, só é gravada como `senhaHash` |
| `cpf`           | não                | string                              |
| `telefone`      | não                | string                              |
| `status`        | gerado pelo sistema| inicia como `Em triagem`            |

### POST `/api/doador/cadastro`

Cria a conta do doador.

Pedido:

```http
POST /api/doador/cadastro
Content-Type: application/json

{
  "nome": "Marina Alves",
  "email": "marina.alves@email.com",
  "tipoSanguineo": "O-",
  "senha": "segredo123",
  "cpf": "123.456.789-00",
  "telefone": "(83) 99999-0000"
}
```

`201 Created`:

```json
{
  "id": "6750f1c2e4b0a1d2c3e4f5a6",
  "nome": "Marina Alves",
  "email": "marina.alves@email.com",
  "tipoSanguineo": "O-",
  "cpf": "123.456.789-00",
  "telefone": "(83) 99999-0000",
  "status": "Em triagem",
  "createdAt": "2026-11-08T12:00:00.000Z",
  "updatedAt": "2026-11-08T12:00:00.000Z"
}
```

Erros:

| Código | Quando                                   | Corpo                                                              |
| ------ | ---------------------------------------- | ------------------------------------------------------------------ |
| `400`  | `nome`, `email`, `tipoSanguineo` ou `senha` ausente/vazio | `{ "erro": "Campos obrigatórios ausentes: email, senha." }` |
| `400`  | senha com menos de 6 caracteres          | `{ "erro": "A senha deve ter no mínimo 6 caracteres." }`           |
| `400`  | e-mail com formato inválido              | `{ "erro": "Informe um e-mail válido." }`                          |
| `409`  | e-mail já cadastrado                     | `{ "erro": "E-mail já cadastrado. Deseja recuperar a senha?" }`    |

### POST `/api/doador/login`

Pedido:

```http
POST /api/doador/login
Content-Type: application/json

{
  "email": "marina.alves@email.com",
  "senha": "segredo123"
}
```

`200 OK`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doador": {
    "id": "6750f1c2e4b0a1d2c3e4f5a6",
    "nome": "Marina Alves",
    "email": "marina.alves@email.com",
    "tipoSanguineo": "O-",
    "cpf": "123.456.789-00",
    "telefone": "(83) 99999-0000",
    "status": "Em triagem",
    "createdAt": "2026-11-08T12:00:00.000Z",
    "updatedAt": "2026-11-08T12:00:00.000Z"
  }
}
```

Erros:

| Código | Quando                        | Corpo                                             |
| ------ | ----------------------------- | ------------------------------------------------- |
| `400`  | `email` ou `senha` ausente    | `{ "erro": "Campos obrigatórios ausentes: senha." }` |
| `401`  | e-mail inexistente ou senha errada | `{ "erro": "E-mail ou senha inválidos" }`    |

A mensagem é a mesma nos dois casos, para não revelar quais e-mails existem.

### GET `/api/doador/perfil`

Exige o token devolvido no login.

```http
GET /api/doador/perfil
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

`200 OK`: devolve os mesmos campos de `doador` mostrados no login (sem `senhaHash`).

Erros:

| Código | Quando                                  | Corpo                                          |
| ------ | --------------------------------------- | ---------------------------------------------- |
| `401`  | cabeçalho `Authorization` ausente       | `{ "erro": "Token de autenticação ausente." }` |
| `401`  | token inválido, expirado ou doador removido | `{ "erro": "Token inválido ou expirado." }` |

### Como testar com curl

```bash
# 1. Cadastro
curl -X POST http://localhost:3001/api/doador/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"Marina Alves","email":"marina.alves@email.com","tipoSanguineo":"O-","senha":"segredo123"}'

# 2. Login (guarde o token da resposta)
curl -X POST http://localhost:3001/api/doador/login \
  -H "Content-Type: application/json" \
  -d '{"email":"marina.alves@email.com","senha":"segredo123"}'

# 3. Perfil
curl http://localhost:3001/api/doador/perfil \
  -H "Authorization: Bearer COLE_O_TOKEN_AQUI"
```

---

## Doadores

- Coleção: `DoadoresCCadastro`
- Cadastro e login pela plataforma do doador: veja [Autenticação do doador](#autenticação-do-doador-uc06).
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
