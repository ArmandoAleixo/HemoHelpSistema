# language: pt
@RF07
Funcionalidade: Visualizar e editar perfil do doador
  Como doador
  Quero visualizar e editar meu perfil
  Para manter meus dados atualizados

  @UC07
  Cenário: Doador edita seu perfil com sucesso
    Dado que estou autenticado como doador (UC06)
    E estou na seção "Meu perfil"
    Quando eu edito os campos desejados
    E confirmo a alteração
    Então o sistema deve salvar as alterações

  @UC07
  Cenário: Doador tenta remover um dado obrigatório do perfil
    Dado que estou autenticado como doador (UC06)
    E estou na seção "Meu perfil"
    Quando eu removo um campo obrigatório
    E confirmo a alteração
    Então o sistema deve bloquear o salvamento