# language: pt

@RF27 @FaseFutura
Funcionalidade: Prever meses de alta demanda dos estoques
  Como administrador ou agente de saúde
  Quero visualizar a previsão de meses de alta demanda
  Para me antecipar a períodos de maior necessidade de sangue


  @UC27
  Cenário: Usuário visualiza a previsão de demanda
    Dado que estou autenticado no Sistema Privado (UC20)
    E existem dados históricos suficientes
    Quando eu acesso o painel de previsão de demanda
    Então o sistema deve exibir a previsão de meses de alta demanda


  @UC27
  Cenário: Dados insuficientes para gerar a previsão de demanda
    Dado que estou autenticado no Sistema Privado (UC20)
    E não existem dados históricos suficientes
    Quando eu acesso o painel de previsão de demanda
    Então o sistema deve informar que a previsão não pode ser gerada

