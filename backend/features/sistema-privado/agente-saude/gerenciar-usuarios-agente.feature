# language: pt

@RF24
Funcionalidade: Gerenciar usuários e administradores (Agente de Saúde)
  Como agente de saúde
  Quero gerenciar usuários e administradores
  Para apoiar o controle de acesso ao Sistema Privado


  @UC24
  Cenário: Agente de saúde cadastra ou edita um usuário
    Dado que estou autenticado como agente de saúde (UC20)
    E estou no painel de usuários
    Quando eu cadastro ou edito um usuário/administrador
    Então o sistema deve salvar as alterações


  @UC24
  Cenário: Agente de saúde tenta salvar usuário com dados incompletos
    Dado que estou autenticado como agente de saúde (UC20)
    E estou no painel de usuários
    Quando eu tento salvar um usuário sem preencher um campo obrigatório
    Então o sistema deve bloquear o salvamento
