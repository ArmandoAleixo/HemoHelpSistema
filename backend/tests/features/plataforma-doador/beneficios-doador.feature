# language: pt

@RF09
Funcionalidade: Visualizar benefícios do doador
  Como doador
  Quero visualizar os benefícios disponíveis
  Para conhecer as vantagens de doar


  @UC09
  Cenário: Doador visualiza a lista de benefícios
    Dado que estou autenticado como doador (UC06)
    E existem benefícios cadastrados
    Quando eu acesso a seção "Benefícios"
    Então o sistema deve exibir a lista de benefícios disponíveis


  @UC09
  Cenário: Doador consulta benefícios quando não há nenhum cadastrado
    Dado que estou autenticado como doador (UC06)
    E não existem benefícios cadastrados
    Quando eu acesso a seção "Benefícios"
    Então o sistema deve exibir uma mensagem informativa

