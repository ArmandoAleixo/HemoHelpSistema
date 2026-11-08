# language: pt
@RF26 @FaseFutura
Funcionalidade: Prever meses de alta e baixa nos estoques
  Como administrador ou agente de saúde
  Quero visualizar a previsão de meses de alta e baixa nos estoques
  Para antecipar períodos críticos


  @UC26
  Cenário: Usuário visualiza a previsão de estoque
    Dado que estou autenticado no Sistema Privado (UC20)
    E existem dados históricos suficientes
    Quando eu acesso o painel de previsão de estoque
    Então o sistema deve exibir a previsão de meses de alta e baixa


  @UC26
  Cenário: Dados insuficientes para gerar a previsão de estoque
    Dado que estou autenticado no Sistema Privado (UC20)
    E não existem dados históricos suficientes
    Quando eu acesso o painel de previsão de estoque
    Então o sistema deve informar que a previsão não pode ser gerada

