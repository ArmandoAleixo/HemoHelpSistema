function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

function formatarData(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

function formatarHorario(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
  if (digitos.length <= 6) {
    return `${digitos.slice(0, 2)}:${digitos.slice(2, 4)} - ${digitos.slice(4)}`;
  }
  return `${digitos.slice(0, 2)}:${digitos.slice(2, 4)} - ${digitos.slice(4, 6)}:${digitos.slice(6)}`;
}

function formatarPlaca(valor: string) {
  const caracteres = valor
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
  return caracteres.length <= 3 ? caracteres : `${caracteres.slice(0, 3)}-${caracteres.slice(3)}`;
}

function formatarCpf(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  if (digitos.length <= 9) {
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  }
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

function formatarTelefone(valor: string) {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length <= 2) return digitos.length ? `(${digitos}` : "";
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function formatarCampo(campo: string, valor: string) {
  if (campo === "inicio") return formatarData(valor);
  if (campo === "horario") return formatarHorario(valor);
  if (campo === "placa") return formatarPlaca(valor);
  if (campo === "cpf") return formatarCpf(valor);
  if (campo === "telefone") return formatarTelefone(valor);
  return valor;
}

export function valorInicialCampo(campo: string, valor: string) {
  if (campo === "inicio" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
  }
  return formatarCampo(campo, valor);
}
