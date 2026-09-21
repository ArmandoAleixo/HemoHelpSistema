# language : pt

@RF16
Funcionalidade: Gerenciar cidades atendidas
  Como administrador
  Quero gerenciar as cidades atendidas pela plataforma
  Para manter a cobertura geográfica atualizada


  @UC16
  Cenário: Administrador cadastra uma nova cidade
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de cidades
    Quando eu cadastro uma nova cidade
    Então o sistema deve salvar a cidade na lista de cidades atendidas


  @UC16
  Cenário: Administrador tenta cadastrar uma cidade já existente
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de cidades
    Quando eu tento cadastrar uma cidade já cadastrada
    Então o sistema deve alertar sobre a duplicidade
