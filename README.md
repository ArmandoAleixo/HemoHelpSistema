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
