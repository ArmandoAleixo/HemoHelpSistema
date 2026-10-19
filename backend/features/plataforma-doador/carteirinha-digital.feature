# language: pt

@RF12 @FaseFutura
Funcionalidade: Gerar carteirinha digital do doador
  Como doador
  Quero gerar uma carteirinha digital
  Para ter meus dados de doador sempre à mão


  @UC12
  Cenário: Doador gera a carteirinha digital com sucesso
    Dado que estou autenticado como doador (UC06)
    E meu perfil está completo
    Quando eu acesso a seção "Carteirinha digital"
    Então o sistema deve gerar a carteirinha com os dados do doador


  @UC12
  Cenário: Doador tenta gerar carteirinha com perfil incompleto
    Dado que estou autenticado como doador (UC06)
    E meu perfil está incompleto
    Quando eu acesso a seção "Carteirinha digital"
    Então o sistema deve solicitar que eu complete o cadastro antes de gerar a carteirinha

