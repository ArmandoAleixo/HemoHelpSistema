# language: pt
@RF15
Funcionalidade: Gerenciar unidades móveis
  Como administrador
  Quero gerenciar unidades móveis de coleta
  Para manter os pontos de coleta atualizados


  @UC15
  Cenário: Administrador cadastra ou edita uma unidade móvel
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de unidades móveis
    Quando eu cadastro ou edito uma unidade
    Então o sistema deve salvar as alterações


  @UC15
  Cenário: Administrador tenta cadastrar unidade com endereço inválido
    Dado que estou autenticado como administrador (UC20)
    E estou no painel de unidades móveis
    Quando eu informo um endereço inválido
    Então o sistema deve bloquear o salvamento
