# language: pt
@RF01
Funcionalidade: Consultar campanhas de doação disponíveis
  Como visitante
  Quero consultar as campanhas de doação disponíveis
  Para saber onde e quando posso doar sangue

  @UC01
  Cenário: Visitante consulta campanhas de doação disponíveis
    Dado que estou na Landing Page do HemoHelp
    E existe ao menos uma campanha cadastrada
    Quando eu acesso a seção "Campanhas"
    Então o sistema deve exibir a lista de campanhas disponíveis
    E cada campanha deve mostrar nome, período e local

  @UC01
  Cenário: Visitante consulta campanhas quando não há nenhuma cadastrada
    Dado que estou na Landing Page do HemoHelp
    E não existe nenhuma campanha cadastrada
    Quando eu acesso a seção "Campanhas"
    Então o sistema deve exibir uma mensagem informando que não há campanhas disponíveis