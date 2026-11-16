import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { areas } from "@/features/gestao/config/areas";
import { obterStatusEstoque } from "@/features/gestao/domain/estoque";
import type { AreaKey, Registro } from "@/features/gestao/domain/models";
import { useDados } from "@/features/gestao/hooks/use-dados";
import { buscar, enviarImagemCampanha } from "@/features/gestao/services/gestao-api";
import { formatarCampo, valorInicialCampo } from "@/features/gestao/utils/input-masks";
import { StatusBadge } from "./status-badge";

type Modal = { tipo: "criar" | "editar" | "ver" | "excluir"; registro?: Registro } | null;

function lerArquivoComoDataUri(arquivo: File) {
  return new Promise<string>((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result));
    leitor.onerror = () => reject(new Error("Nao foi possivel ler a imagem selecionada."));
    leitor.readAsDataURL(arquivo);
  });
}

function urlGoogleMaps(registro: Registro) {
  const destino =
    [registro["rua"], registro["bairro"]].filter((parte) => Boolean(parte?.trim())).join(", ") ||
    registro["endereco"]?.trim() ||
    registro["nome"] || "";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
}

export function CrudPage({ areaKey }: { areaKey: AreaKey }) {
  const area = areas.find((item) => item.key === areaKey)!;
  const { dados, salvar, excluir } = useDados();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [modal, setModal] = useState<Modal>(null);
  const [salvando, setSalvando] = useState(false);
  const [consultaCep, setConsultaCep] = useState("");
  const formularioRef = useRef<HTMLFormElement>(null);
  const consultaCepId = useRef(0);

  const consultarCep = async (valor: string) => {
    const cep = valor.replace(/\D/g, "");
    const id = ++consultaCepId.current;
    setConsultaCep("");
    if (cep.length !== 8) return;
    setConsultaCep("Consultando CEP...");
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!resposta.ok) throw new Error("Falha na consulta");
      const endereco = (await resposta.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (id !== consultaCepId.current) return;
      if (endereco.erro) {
        setConsultaCep("CEP não encontrado.");
        return;
      }
      const formulario = formularioRef.current;
      const preencher = (campo: string, conteudo?: string) => {
        const input = formulario?.elements.namedItem(campo);
        if (input instanceof HTMLInputElement && conteudo) input.value = conteudo;
      };
      preencher("rua", endereco.logradouro);
      preencher("bairro", endereco.bairro);
      preencher("cidade", endereco.localidade);
      preencher("estado", endereco.uf);
      setConsultaCep("Endereço preenchido pelo CEP.");
    } catch {
      if (id === consultaCepId.current) setConsultaCep("Falha ao consultar o CEP. Tente novamente.");
    }
  };

  const registros =
    areaKey === "locais"
      ? [
          ...dados.locais,
          ...dados.campanhas.map((campanha): Registro => ({
            id: `campanha:${campanha.id}`,
            nome: campanha["nome"] ?? "Campanha",
            bairro: campanha["bairro"] ?? "",
            rua: campanha["rua"] ?? "",
            endereco: [campanha["rua"], campanha["bairro"]].filter(Boolean).join(", "),
            horario: [campanha["horarioInicio"], campanha["horarioFim"]]
              .filter(Boolean)
              .join(" - "),
            status: campanha["status"] ?? "",
            origem: "campanha",
          })),
        ]
      : dados[areaKey];
  const statusOptions = [
    ...(area.campos.find((campo) => campo.key === "status")?.options ?? []),
    ...(areaKey === "locais" ? ["Ativa", "Agendada", "Finalizada"] : []),
  ];
  const filtrados = useMemo(
    () =>
      registros.filter((registro) => {
        const status =
          areaKey === "estoque" ? obterStatusEstoque(registro) : (registro["status"] ?? "");
        const bateBusca =
          Object.values(registro).some((valor) =>
            valor.toLowerCase().includes(busca.toLowerCase()),
          ) || status.toLowerCase().includes(busca.toLowerCase());
        return bateBusca && (filtro === "Todos" || status === filtro);
      }),
    [areaKey, busca, filtro, registros],
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const registro: Registro = { id: modal?.registro?.id ?? crypto.randomUUID() };
    area.campos.forEach((campo) => {
      if (campo.type === "file") return;
      const valor = String(form.get(campo.key) ?? "");
      if (areaKey === "usuarios" && campo.key === "senha" && !valor && modal?.tipo === "editar") return;
      registro[campo.key] = valor;
    });
    if (modal?.registro?.["imagemUrl"]) registro["imagemUrl"] = modal.registro["imagemUrl"];
    if (modal?.registro?.["imagemPublicId"])
      registro["imagemPublicId"] = modal.registro["imagemPublicId"];
    if (areaKey === "estoque") {
      if (modal?.registro) registro["nome"] = modal.registro["nome"] ?? "";
      registro["status"] = obterStatusEstoque(registro);
    }
    setSalvando(true);
    try {
      if (areaKey === "campanhas") {
        const arquivo = form.get("imagemUrl");
        if (arquivo instanceof File && arquivo.size > 0) {
          if (arquivo.size > 5 * 1024 * 1024) throw new Error("A imagem deve ter no maximo 5 MB.");
          const imagem = await enviarImagemCampanha(await lerArquivoComoDataUri(arquivo));
          registro["imagemUrl"] = imagem.imagemUrl;
          registro["imagemPublicId"] = imagem.imagemPublicId;
        }
      }
      await salvar(areaKey, registro);
      toast.success("Registro salvo no banco de dados.");
      setModal(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel salvar no banco.");
    } finally {
      setSalvando(false);
    }
  };

  const abrirDetalhes = async (registro: Registro) => {
    try {
      const registroCompleto = await buscar(areaKey, registro.id);
      setModal({ tipo: "ver", registro: registroCompleto });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Nao foi possivel carregar os detalhes.",
      );
    }
  };

  return (
    <section className="animate-page-in">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{area.nome}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{area.descricao}</p>
        </div>
        {areaKey !== "estoque" && (
          <Button onClick={() => setModal({ tipo: "criar" })}>
            <Plus />
            Adicionar {area.singular}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-panel">
        {areaKey !== "estoque" && (
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                className="pl-9"
                placeholder={`Buscar em ${area.nome.toLowerCase()}...`}
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <select
                value={filtro}
                onChange={(event) => setFiltro(event.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option>Todos</option>
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <Table>
          <TableHeader className="bg-table-head">
            <TableRow>
              {area.campos.map((campo) => (
                <TableHead
                  key={campo.key}
                  className="whitespace-nowrap px-5 text-xs font-semibold uppercase tracking-wide"
                >
                  {campo.label}
                </TableHead>
              ))}
              <TableHead className="w-16 px-5 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((registro) => (
              <TableRow
                key={registro.id}
                onClick={areaKey === "campanhas" ? () => void abrirDetalhes(registro) : undefined}
                className={
                  areaKey === "campanhas"
                    ? "cursor-pointer border-b-2 border-border transition-colors hover:bg-muted/60"
                    : undefined
                }
                title={
                  areaKey === "campanhas" ? "Clique para visualizar todos os dados" : undefined
                }
              >
                {area.campos.map((campo, index) => (
                  <TableCell key={campo.key} className="max-w-64 px-5 py-3.5">
                    <span
                      className={
                        index === 0 ? "font-medium text-foreground" : "text-muted-foreground"
                      }
                    >
                      {campo.type === "file" ? (
                        registro[campo.key] ? (
                          <img
                            src={registro[campo.key]}
                            alt={`Imagem de ${registro["nome"] ?? "campanha"}`}
                            className="h-12 w-20 rounded-md object-cover"
                          />
                        ) : (
                          <span>Sem imagem</span>
                        )
                      ) : campo.key === "status" ? (
                        <StatusBadge
                          status={
                            areaKey === "estoque"
                              ? obterStatusEstoque(registro)
                              : (registro[campo.key] ?? "")
                          }
                        />
                      ) : campo.key === "porcentagem" ? (
                        `${registro[campo.key] ?? "0"}%`
                      ) : campo.type === "password" ? (
                        "••••••••"
                      ) : (
                        registro[campo.key]
                      )}
                    </span>
                  </TableCell>
                ))}
                <TableCell
                  className="px-5 text-right"
                  onClick={areaKey === "campanhas" ? (event) => event.stopPropagation() : undefined}
                >
                  {areaKey === "locais" ? (
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={urlGoogleMaps(registro)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Encaminhar ${registro["nome"]} no Google Maps`}
                        title="Encaminhar no Google Maps"
                        className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <MapPin className="size-4" />
                      </a>
                      {registro["origem"] !== "campanha" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Ações de ${registro["nome"]}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => void abrirDetalhes(registro)}>
                              <Eye />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setModal({ tipo: "editar", registro })}>
                              <Pencil />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setModal({ tipo: "excluir", registro })}
                            >
                              <Trash2 />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ) : areaKey === "estoque" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar ${registro["nome"]}`}
                      onClick={() => setModal({ tipo: "editar", registro })}
                    >
                      <Pencil />
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Ações de ${registro["nome"]}`}
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => void abrirDetalhes(registro)}>
                          <Eye />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModal({ tipo: "editar", registro })}>
                          <Pencil />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setModal({ tipo: "excluir", registro })}
                        >
                          <Trash2 />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtrados.length === 0 && (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground/50" />
            <p className="font-medium">Nenhum registro encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">Tente ajustar a busca ou o filtro.</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
          <span>
            {filtrados.length} de {registros.length} registros
          </span>
          <span>Página 1 de 1</span>
        </div>
      </div>

      <Dialog open={modal !== null} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent>
          {modal?.tipo === "excluir" ? (
            <>
              <DialogHeader>
                <DialogTitle>Excluir {area.singular}?</DialogTitle>
                <DialogDescription>
                  Esta ação removerá "{modal.registro?.["nome"]}" dos registros.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" disabled={salvando} onClick={() => setModal(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  disabled={salvando}
                  onClick={async () => {
                    if (!modal.registro) return;
                    setSalvando(true);
                    try {
                      await excluir(areaKey, modal.registro.id);
                      toast.success("Registro excluido.");
                      setModal(null);
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Nao foi possivel excluir o registro.",
                      );
                    } finally {
                      setSalvando(false);
                    }
                  }}
                >
                  Excluir
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form ref={formularioRef} onSubmit={submit}>
              <DialogHeader>
                <DialogTitle>
                  {modal?.tipo === "ver"
                    ? "Detalhes"
                    : modal?.tipo === "editar"
                      ? "Editar"
                      : "Adicionar"}{" "}
                  {area.singular}
                </DialogTitle>
                <DialogDescription>
                  {modal?.tipo === "ver"
                    ? "Confira as informações deste registro."
                    : "Preencha os dados abaixo. Os campos são obrigatórios."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6 sm:grid-cols-2">
                {area.campos
                  .filter((campo) => !(areaKey === "estoque" && campo.key === "status"))
                  .map((campo, index) => (
                    <div key={campo.key} className={index === 0 ? "sm:col-span-2" : ""}>
                      <Label htmlFor={campo.key}>{campo.label}</Label>
                      {campo.type === "file" ? (
                        modal?.tipo === "ver" ? (
                          modal.registro?.[campo.key] ? (
                            <img
                              src={modal.registro[campo.key]}
                              alt={`Imagem de ${modal.registro["nome"] ?? "campanha"}`}
                              className="mt-1.5 max-h-56 w-full rounded-md object-cover"
                            />
                          ) : (
                            <p className="mt-1.5 text-sm text-muted-foreground">
                              Sem imagem cadastrada.
                            </p>
                          )
                        ) : (
                          <>
                            {modal?.registro?.[campo.key] && (
                              <img
                                src={modal.registro[campo.key]}
                                alt="Imagem atual da campanha"
                                className="mt-1.5 mb-2 h-24 w-40 rounded-md object-cover"
                              />
                            )}
                            <Input
                              id={campo.key}
                              name={campo.key}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="mt-1.5"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              JPG, PNG ou WebP, ate 5 MB.
                            </p>
                          </>
                        )
                      ) : campo.options ? (
                        <select
                          id={campo.key}
                          name={campo.key}
                          defaultValue={modal?.registro?.[campo.key] ?? campo.options[0] ?? ""}
                          disabled={
                            modal?.tipo === "ver" || (areaKey === "estoque" && campo.key === "nome")
                          }
                          className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-60"
                        >
                          {campo.options.map((opcao) => (
                            <option key={opcao}>{opcao}</option>
                          ))}
                        </select>
                      ) : campo.key === "porcentagem" ? (
                        <div className="relative mt-1.5">
                          <Input
                            id={campo.key}
                            name={campo.key}
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={modal?.registro?.[campo.key] ?? "0"}
                            disabled={modal?.tipo === "ver"}
                            required
                            className="pr-8"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                            %
                          </span>
                        </div>
                      ) : (
                        <Input
                          id={campo.key}
                          name={campo.key}
                          type={
                            campo.type === "password"
                              ? "password"
                              :
                            campo.key === "inicio" ||
                            campo.key === "fim" ||
                            campo.key === "horarioInicio" ||
                            campo.key === "horarioFim" ||
                            campo.key === "horario"
                              ? "text"
                              : (campo.type ?? "text")
                          }
                          inputMode={
                            campo.key === "inicio" ||
                            campo.key === "fim" ||
                            campo.key === "horarioInicio" ||
                            campo.key === "horarioFim" ||
                            campo.key === "horario" ||
                            campo.key === "cpf" ||
                            campo.key === "telefone"
                              ? "numeric"
                              : undefined
                          }
                          maxLength={
                            campo.key === "cep"
                              ? 9
                              : campo.key === "inicio"
                              ? 10
                              : campo.key === "fim"
                                ? 10
                                : campo.key === "horarioInicio" || campo.key === "horarioFim"
                                  ? 5
                                  : campo.key === "horario"
                                    ? 13
                                    : campo.key === "cpf"
                                        ? 14
                                        : campo.key === "telefone"
                                          ? 15
                                          : undefined
                          }
                          defaultValue={valorInicialCampo(
                            campo.key,
                            modal?.registro?.[campo.key] ?? "",
                          )}
                          onChange={(event) => {
                            if (campo.key === "cep") {
                              const cep = event.currentTarget.value.replace(/\D/g, "").slice(0, 8);
                              event.currentTarget.value = cep.length > 5
                                ? `${cep.slice(0, 5)}-${cep.slice(5)}`
                                : cep;
                              void consultarCep(event.currentTarget.value);
                              return;
                            }
                            const valorFormatado = formatarCampo(
                              campo.key,
                              event.currentTarget.value,
                            );
                            if (valorFormatado !== event.currentTarget.value)
                              event.currentTarget.value = valorFormatado;
                          }}
                          disabled={
                            modal?.tipo === "ver" || (areaKey === "estoque" && campo.key === "nome")
                          }
                          required={!(areaKey === "usuarios" && campo.key === "senha" && modal?.tipo === "editar")}
                          autoComplete={campo.type === "password" ? "new-password" : undefined}
                          className="mt-1.5"
                        />
                      )}
                      {campo.key === "cep" && consultaCep && (
                        <p className="mt-1 text-xs text-muted-foreground" role="status">
                          {consultaCep}
                        </p>
                      )}
                    </div>
                  ))}
                {modal?.tipo === "ver" && modal.registro && (
                  <div className="sm:col-span-2">
                    <div className="mb-3 mt-1 border-t pt-4">
                      <p className="text-sm font-medium">Informações completas do banco</p>
                    </div>
                    <dl className="grid gap-3 rounded-md border bg-muted/30 p-4 sm:grid-cols-2">
                      {Object.entries(modal.registro)
                        .filter(
                          ([chave]) =>
                            chave !== "placa" &&
                            chave !== "meta" &&
                            !area.campos.some((campo) => campo.key === chave),
                        )
                        .map(([chave, valor]) => (
                          <div key={chave} className="min-w-0">
                            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {chave === "id"
                                ? "ID"
                                : chave === "createdAt"
                                  ? "Criado em"
                                  : chave === "updatedAt"
                                    ? "Atualizado em"
                                    : chave === "imagemPublicId"
                                      ? "Public ID da imagem"
                                      : chave}
                            </dt>
                            <dd className="mt-1 break-all text-sm text-foreground">
                              {valor || "—"}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModal(null)}>
                  {modal?.tipo === "ver" ? "Fechar" : "Cancelar"}
                </Button>
                {modal?.tipo !== "ver" && (
                  <Button type="submit" disabled={salvando}>
                    {salvando ? "Salvando..." : "Salvar"}
                  </Button>
                )}
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
