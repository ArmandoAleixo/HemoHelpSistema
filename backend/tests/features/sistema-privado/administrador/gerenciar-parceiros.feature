# language: pt

@RF18
Funcionalidade: Gerenciar instituições parceiras
  Como administrador
  Quero gerenciar instituições parceiras
  Para exibi-las na plataforma


  @UC18
  Cenário: Administrador cadastra uma nova instituição parceira
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de parceiros
    Quando eu cadastro uma nova instituição
    Então o sistema deve salvar o cadastro


  @UC18
  Cenário: Administrador tenta cadastrar uma instituição já existente
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de parceiros
    Quando eu tento cadastrar uma instituição já cadastrada
    Então o sistema deve alertar sobre a duplicidade
