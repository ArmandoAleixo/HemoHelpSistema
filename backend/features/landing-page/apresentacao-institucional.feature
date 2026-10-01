# language: pt
@RF05
Funcionalidade: Acessar apresentação institucional
  Como visitante
  Quero conhecer a apresentação institucional da plataforma
  Para entender a proposta do HemoHelp e seus parceiros

  @UC05
  Cenário: Visitante acessa a apresentação institucional publicada
    Dado que estou na Landing Page do HemoHelp
    E o conteúdo institucional está publicado
    Quando eu acesso a seção "Sobre"
    Então o sistema deve exibir a apresentação da plataforma e das instituições parceiras

  @UC05
  Cenário: Visitante acessa a apresentação institucional quando não publicada
    Dado que estou na Landing Page do HemoHelp
    E o conteúdo institucional não está publicado
    Quando eu acesso a seção "Sobre"
    Então o sistema deve exibir uma mensagem informativaT