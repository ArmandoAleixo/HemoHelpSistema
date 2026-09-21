# language: pt

@RF17
Funcionalidade: Gerenciar campanhas de doação
  Como administrador
  Quero gerenciar campanhas de doação
  Para manter as campanhas atualizadas na Landing Page e na Plataforma do Doador


  @UC17
  Cenário: Administrador cadastra uma nova campanha
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de campanhas
    Quando eu cadastro uma nova campanha com nome, período e local
    Então o sistema deve salvar a campanha
    E deve refletir a nova campanha na Landing Page e na Plataforma do Doador


  @UC17
  Cenário: Administrador tenta salvar campanha com dados incompletos
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de campanhas
    Quando eu tento salvar uma campanha sem preencher um campo obrigatório
    Então o sistema deve bloquear o salvamento

