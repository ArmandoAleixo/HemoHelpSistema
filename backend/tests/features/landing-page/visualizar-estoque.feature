# language: pt
@RF04
Funcionalidade: Visualizar estoque público de sangue
  Como visitante
  Quero visualizar o estoque público de sangue
  Para saber quais tipos sanguíneos são mais necessários

  @UC04
  Cenário: Visitante visualiza os níveis de estoque atualizados
    Dado que estou na Landing Page do HemoHelp
    E o administrador atualizou os dados de estoque
    Quando eu acesso a seção "Estoque de sangue"
    Então o sistema deve exibir os níveis por tipo sanguíneo
    E deve mostrar a data da última atualização

  @UC04
  Cenário: Visitante visualiza estoque com dados desatualizados
    Dado que estou na Landing Page do HemoHelp
    E os dados de estoque estão desatualizados
    Quando eu acesso a seção "Estoque de sangue"
    Então o sistema deve exibir a data da última atualização disponível
    E deve exibir um aviso de que os dados podem estar desatualizados