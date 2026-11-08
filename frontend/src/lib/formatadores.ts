// Formatadores compartilhados entre o painel de gestão e a área do doador.
// A máscara de CPF e de telefone precisa ser a mesma nos dois lugares.

export function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export function formatarCpf(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  if (digitos.length <= 9) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  }
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

export function formatarTelefone(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;

  const ddd = digitos.slice(0, 2);
  const resto = digitos.slice(2);
  // 10 dígitos = fixo (0000-0000); 11 dígitos = celular (00000-0000).
  const tamanhoPrimeiraParte = digitos.length <= 10 ? 4 : 5;

  if (resto.length <= tamanhoPrimeiraParte) return `(${ddd}) ${resto}`;
  return `(${ddd}) ${resto.slice(0, tamanhoPrimeiraParte)}-${resto.slice(tamanhoPrimeiraParte)}`;
}

// Telefone aceita fixo (10 dígitos) ou celular (11 dígitos).
export function telefoneValido(valor: string) {
  const digitos = apenasDigitos(valor);
  return digitos.length === 10 || digitos.length === 11;
}

// Fase de testes: só confere se tem 11 números.
// TODO: validação completa de CPF após aprovação do projeto.
export function cpfValido(valor: string) {
  return apenasDigitos(valor).length === 11;
}
