# language: pt
@RF03
Funcionalidade: Consultar critérios para doação
  Como visitante
  Quero consultar os critérios para doação de sangue
  Para saber se estou apto a doar

  @UC03
  Cenário: Visitante consulta critérios de doação publicados
    Dado que estou na Landing Page do HemoHelp
    E o conteúdo de critérios está publicado
    Quando eu acesso a seção "Critérios para doação"
    Então o sistema deve exibir o conteúdo estruturado por categoria

  @UC03
  Cenário: Visitante consulta critérios quando o conteúdo não está publicado
    Dado que estou na Landing Page do HemoHelp
    E o conteúdo de critérios não está publicado
    Quando eu acesso a seção "Critérios para doação"
    Então o sistema deve exibir uma mensagem informando que o conteúdo está em atualização