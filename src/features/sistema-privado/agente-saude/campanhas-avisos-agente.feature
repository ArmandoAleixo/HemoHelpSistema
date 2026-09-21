# language: pt

@RF22
Funcionalidade: Gerenciar campanhas, avisos e parcerias
  Como agente de saúde
  Quero gerenciar campanhas, avisos e parcerias
  Para manter as informações públicas atualizadas


  @UC22
  Cenário: Agente de saúde publica uma campanha, aviso ou parceria
    Dado que estou autenticado como agente de saúde (UC20)
    E estou no painel correspondente
    Quando eu cadastro, edito ou publico uma campanha, aviso ou parceria
    Então o sistema deve salvar e refletir a alteração nos sistemas públicos


  @UC22
  Cenário: Agente de saúde tenta salvar com dados incompletos
    Dado que estou autenticado como agente de saúde (UC20)
    E estou no painel correspondente
    Quando eu tento salvar sem preencher um campo obrigatório
    Então o sistema deve bloquear o salvamento
