# language: pt

@RF23
Funcionalidade: Registrar quantidade de doações realizadas
  Como agente de saúde
  Quero registrar a quantidade de doações realizadas
  Para manter o histórico de doações atualizado


  @UC23
  Cenário: Agente de saúde registra doações de uma campanha ou unidade
    Dado que estou autenticado como agente de saúde (UC20)
    E existe uma campanha ou unidade cadastrada
    Quando eu informo a quantidade de doações realizadas
    Então o sistema deve salvar o registro


  @UC23
  Cenário: Agente de saúde tenta registrar uma quantidade inválida
    Dado que estou autenticado como agente de saúde (UC20)
    E existe uma campanha ou unidade cadastrada
    Quando eu informo uma quantidade inválida de doações
    Então o sistema deve rejeitar o registro

