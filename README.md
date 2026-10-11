# HemoHelpSistema

Sistema privado para gestão de estoque de sangue, campanhas, locais de coleta, unidades móveis, parceiros, doadores e agentes de saúde.

## Estrutura

```text
backend/
  server.js               Entrada da API
  src/
    config/                Ambiente e recursos disponíveis
    database/              Conexão com o MongoDB
    http/                  Leitura e resposta HTTP
    repositories/          Operações de persistência
    routes/                Rotas e fluxo das requisições

frontend/
  src/
    components/            Componentes visuais reutilizáveis
    features/gestao/       Domínio da gestão de estoque e cadastros
    images/                Imagens e ícones da aplicação
    routes/                Páginas e rotas do frontend
    styles.css             Estilos globais
  public/                  Assets públicos

backend/features/          Especificações Gherkin
```

## Execução

```bash
npm run dev:backend
npm run dev
```

O frontend usa `VITE_API_URL` e o backend usa `MONGODB_URI`, `MONGODB_DB` e `PORT` definidos no arquivo `.env`.


## Configuração do banco de dados

O backend usa MongoDB. Para configurar o banco localmente:

1. Instale ou crie um banco no [MongoDB Atlas](https://www.mongodb.com/atlas) (ou use uma instância local).
2. Copie `.env.example` para `.env`.
3. Preencha `MONGODB_URI` com a string de conexão do seu banco e defina `MONGODB_DB` com o nome do banco desejado.
4. No MongoDB Atlas, adicione o seu IP em **Network Access** e confirme que o usuário da URI tem permissão de leitura e escrita.
5. Inicie a API com `npm run dev:backend`.

Na primeira conexão, a API verifica as coleções necessárias e cria automaticamente as que ainda não existirem. As coleções são `DoadoresCCadastro`, `AgentesSaude`, `Campanhas`, `EstoqueSangue`, `LocaisColeta`, `Parceiros` e `UnidadesMoveis`. Esse processo é seguro para execuções posteriores e não remove dados existentes.

### Relacionamentos

Os relacionamentos opcionais usam IDs do MongoDB (`ObjectId`) e são indexados automaticamente na primeira conexão:

- `Campanhas.localColetaId` → `LocaisColeta._id`
- `Campanhas.parceiroId` → `Parceiros._id`
- `Campanhas.unidadeMovelId` → `UnidadesMoveis._id`
- `Campanhas.responsavelId` → `AgentesSaude._id`
- `AgentesSaude.unidadeMovelId` → `UnidadesMoveis._id`

O MongoDB não aplica chave estrangeira automaticamente. A API deve validar se o ID referenciado existe antes de salvar. Como o banco configurado atualmente está sem registros, nenhuma referência foi criada artificialmente.
