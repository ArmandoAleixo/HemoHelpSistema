# language: pt

@RF11
Funcionalidade: Visualizar estoque público de sangue (logado)
  Como doador
  Quero visualizar o estoque público de sangue
  Para saber a necessidade atual por tipo sanguíneo


  @UC11
  Cenário: Doador visualiza os níveis de estoque atualizados
    Dado que estou autenticado como doador (UC06)
    E o administrador atualizou os dados de estoque
    Quando eu acesso a seção "Estoque de sangue"
    Então o sistema deve exibir os níveis por tipo sanguíneo


  @UC11
  Cenário: Doador visualiza estoque com dados desatualizados
    Dado que estou autenticado como doador (UC06)
    E os dados de estoque estão desatualizados
    Quando eu acesso a seção "Estoque de sangue"
    Então o sistema deve exibir a data da última atualização com aviso
