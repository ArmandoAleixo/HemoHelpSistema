# language: pt
@RF06
Funcionalidade: Realizar cadastro e login do doador
  Como doador
  Quero me cadastrar e realizar login na plataforma
  Para acessar as funcionalidades exclusivas de doador

  @UC06
  Cenário: Doador realiza cadastro com sucesso
    Dado que estou na Plataforma do Doador
    E ainda não possuo cadastro
    Quando eu informo meus dados (nome, e-mail, tipo sanguíneo e senha)
    E confirmo o cadastro
    Então o sistema deve validar e criar minha conta

  @UC06
  Cenário: Doador realiza login com sucesso
    Dado que estou na Plataforma do Doador
    E já possuo uma conta cadastrada
    Quando eu informo meu e-mail e senha corretamente
    E clico no botão de login
    Então devo ser autenticado e ter acesso à plataforma

  @UC06
  Cenário: Doador tenta se cadastrar com e-mail já existente
    Dado que estou na Plataforma do Doador
    Quando eu informo um e-mail já cadastrado
    E confirmo o cadastro
    Então o sistema deve informar o conflito
    E deve sugerir a recuperação de senha

  @UC06
  Cenário: Doador informa credenciais incorretas no login
    Dado que estou na Plataforma do Doador
    Quando eu informo e-mail ou senha incorretos
    E clico no botão de login
    Então o sistema deve exibir uma mensagem de erro