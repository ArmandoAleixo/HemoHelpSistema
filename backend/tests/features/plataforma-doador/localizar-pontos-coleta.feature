# language: pt

@RF10
Funcionalidade: Localizar unidades móveis e hemocentros (logado)
  Como doador
  Quero localizar unidades móveis e hemocentros
  Para saber onde posso realizar minha próxima doação


  @UC10
  Cenário: Doador localiza locais de coleta disponíveis
    Dado que estou autenticado como doador (UC06)
    E existem locais de coleta cadastrados
    Quando eu acesso a seção "Locais de coleta"
    Então o sistema deve exibir o mapa com os locais disponíveis


  @UC10
  Cenário: Doador não encontra locais na região buscada
    Dado que estou autenticado como doador (UC06)
    E não existem locais cadastrados na região buscada
    Quando eu acesso a seção "Locais de coleta"
    Então o sistema deve informar que nenhum local foi encontrado
    E deve sugerir ampliar a área de busca
