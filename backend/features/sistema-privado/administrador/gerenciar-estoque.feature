# language: pt

@RF14
Funcionalidade: Gerenciar estoque de sangue
  Como administrador
  Quero gerenciar os dados de estoque de sangue
  Para manter as informações atualizadas na base do sistema


  @UC14
  Cenário: Administrador atualiza os níveis de estoque
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de estoque
    Quando eu insiro ou atualizo os níveis por tipo sanguíneo
    Então o sistema deve salvar os dados na base HELP/HemoHelp


  @UC14
  Cenário: Administrador tenta registrar um valor inválido de estoque
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de estoque
    Quando eu informo um valor negativo para o estoque
    Então o sistema deve rejeitar o registro
