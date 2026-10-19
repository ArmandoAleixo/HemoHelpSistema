# language: pt
@RF20
Funcionalidade: Autenticação de usuários do Sistema Privado
  Como Administrador ou Agente de Saúde
  Quero realizar login no Sistema Privado
  Para acessar as funcionalidades de gestão de acordo com meu perfil

  @UC20
  Cenário: Usuário autorizado realiza login com sucesso
    Dado que estou na página de login do Sistema Privado
    E possuo credenciais cadastradas
    Quando eu informar meu usuário e senha corretamente
    E clico no botão de login
    Então o sistema deve validar minhas credenciais
    E devo ser redirecionado ao painel correspondente ao meu perfil

  @UC20
  Cenário: Usuário informa credenciais incorretas
    Dado que estou na página de login do Sistema Privado
    Quando eu informar usuário ou senha incorretos
    E clico no botão de login
    Então o sistema deve exibir uma mensagem de erro
    E devo permanecer na página de login para tentar novamente

  @UC20
  Cenário: Usuário tenta login com conta inexistente ou bloqueada
    Dado que estou na página de login do Sistema Privado
    Quando eu informar um usuário inexistente ou bloqueado
    E clico no botão de login
    Então o sistema deve informar que o acesso não pode ser concedido
    E deve orientar o contato com o suporte