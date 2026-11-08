# language: pt
@RF02
Funcionalidade: Localizar pontos de coleta e hemocentros
  Como visitante
  Quero localizar pontos de coleta e hemocentros
  Para saber onde posso realizar a doação

  @UC02
  Cenário: Visitante localiza pontos de coleta no mapa
    Dado que estou na Landing Page do HemoHelp
    E existem locais de coleta cadastrados
    Quando eu acesso a seção "Mapas/Locais de coleta"
    Então o sistema deve exibir o mapa com os locais disponíveis
    E devo poder selecionar um local para ver detalhes

  @UC02
  Cenário: Visitante não encontra locais na região buscada
    Dado que estou na Landing Page do HemoHelp
    E não existem locais de coleta cadastrados na região buscada
    Quando eu acesso a seção "Mapas/Locais de coleta"
    Então o sistema deve informar que nenhum local foi encontrado
    E deve sugerir ampliar a área de busca