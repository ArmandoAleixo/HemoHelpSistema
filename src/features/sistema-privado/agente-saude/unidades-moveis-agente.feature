# language: pt

@RF21
Funcionalidade: Gerenciar unidades móveis e quantidade de doações
  Como agente de saúde
  Quero gerenciar unidades móveis e a quantidade de doações por unidade
  Para manter os dados operacionais atualizados


  @UC21
  Cenário: Agente de saúde registra a quantidade de doações de uma unidade
    Dado que estou autenticado como agente de saúde (UC20)
    E estou no painel de unidades móveis
    Quando eu cadastro/edito a unidade e informo a quantidade de doações
    Então o sistema deve salvar os dados


  @UC21
  Cenário: Agente de saúde tenta informar uma quantidade inválida
    Dado que estou autenticado como agente de saúde (UC20)
    E estou no painel de unidades móveis
    Quando eu informo uma quantidade negativa de doações
    Então o sistema deve rejeitar o registro

