# language: pt
@RF13
Funcionalidade: Gerenciar usuários e administradores
  Como administrador
  Quero gerenciar usuários e administradores
  Para manter o controle de acesso ao Sistema Privado


  @UC13
  Cenário: Administrador cadastra ou edita um usuário
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de usuários
    Quando eu cadastro ou edito um usuário/administrador
    E confirmo a operação
    Então o sistema deve salvar as alterações


  @UC13
  Cenário: Administrador tenta salvar usuário com dados incompletos
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de usuários
    Quando eu tento salvar um usuário sem preencher um campo obrigatório
    Então o sistema deve bloquear o salvamento

