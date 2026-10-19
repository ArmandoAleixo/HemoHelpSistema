# language: pt

@RF19
Funcionalidade: Atualizar estoque público exibido
  Como administrador
  Quero publicar os dados de estoque cadastrados
  Para que fiquem visíveis na Landing Page e na Plataforma do Doador


  @UC19
  Cenário: Administrador publica a atualização de estoque
    Dado que estou autenticado como administrador (UC20)
    E existem dados de estoque cadastrados (UC14)
    Quando eu confirmo a atualização pública
    Então o sistema deve atualizar a exibição na Landing Page e na Plataforma do Doador


  @UC19
  Cenário: Administrador tenta publicar dados inconsistentes de estoque
    Dado que estou autenticado como administrador (UC20)
    E os dados de estoque cadastrados estão inconsistentes
    Quando eu tento confirmar a atualização pública
    Então o sistema deve impedir a publicação até a correção dos dados
