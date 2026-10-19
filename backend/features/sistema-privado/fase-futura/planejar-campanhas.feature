# language: pt

@RF25 @FaseFutura
Funcionalidade: Planejar campanhas com dados históricos
  Como administrador ou agente de saúde
  Quero visualizar sugestões de planejamento com base em dados históricos
  Para apoiar a organização de novas campanhas


  @UC25
  Cenário: Usuário visualiza sugestões de planejamento
    Dado que estou autenticado no Sistema Privado (UC20)
    E existem dados históricos suficientes
    Quando eu acesso o painel de análise de dados
    Então o sistema deve exibir sugestões de planejamento com base no histórico


  @UC25
  Cenário: Dados históricos insuficientes para gerar planejamento
    Dado que estou autenticado no Sistema Privado (UC20)
    E não existem dados históricos suficientes
    Quando eu acesso o painel de análise de dados
    Então o sistema deve informar que a análise não pode ser gerada
