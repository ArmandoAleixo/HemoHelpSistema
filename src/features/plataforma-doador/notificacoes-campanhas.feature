# language: pt
@RF08
Funcionalidade: Receber notificações de campanhas e avisos
  Como doador
  Quero receber notificações de campanhas e avisos
  Para me manter informado sobre novidades


  @UC08
  Cenário: Doador recebe notificação de nova campanha
    Dado que estou autenticado como doador (UC06)
    E o administrador ou agente de saúde publica uma nova campanha
    Quando o sistema gera a notificação
    Então devo visualizar a notificação na plataforma


  @UC08
  Cenário: Doador com notificações desativadas não recebe o alerta
    Dado que estou autenticado como doador (UC06)
    E desativei as notificações no meu perfil
    Quando uma nova campanha ou aviso é publicado
    Então a notificação não deve ser exibida para mim
