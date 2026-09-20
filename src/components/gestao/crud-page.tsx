import { useMemo, useState, type FormEvent } from "react";
import { Eye, MoreHorizontal, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { areas, type AreaKey, type Registro } from "@/lib/gestao-data";
import { useDados } from "./data-provider";
import { StatusBadge } from "./status-badge";

type Modal = { tipo: "criar" | "editar" | "ver" | "excluir"; registro?: Registro } | null;

function statusDoEstoque(registro: Registro) {
  const porcentagem = Number(registro["porcentagem"] ?? registro["quantidade"] ?? 0);
  return porcentagem < 20 ? "Estoque crítico" : "Disponível";
}

export function CrudPage({ areaKey }: { areaKey: AreaKey }) {
  const area = areas.find((item) => item.key === areaKey);
  const { dados, salvar, excluir } = useDados();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [modal, setModal] = useState<Modal>(null);

  if (!area) return null;

  const registros = dados[areaKey];
  const statusOptions = area.campos.find((campo) => campo.key === "status")?.options ?? [];
  const filtrados = useMemo(
    () =>
      registros.filter((registro) => {
        const status = areaKey === "estoque" ? statusDoEstoque(registro) : registro["status"];
        const bateBusca = Object.values(registro).some((valor) => valor.toLowerCase().includes(busca.toLowerCase())) || status.toLowerCase().includes(busca.toLowerCase());
        return bateBusca && (filtro === "Todos" || status === filtro);
      }),
    [busca, filtro, registros],
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const registro: Registro = { id: modal?.registro?.id ?? crypto.randomUUID() };
    area.campos.forEach((campo) => {
      registro[campo.key] = String(form.get(campo.key) ?? "");
    });
    if (areaKey === "estoque") {
      if (modal?.registro) registro.nome = modal.registro.nome;
      registro.status = statusDoEstoque(registro);
    }
    salvar(areaKey, registro);
    setModal(null);
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
                <TableHead key={campo.key} className="whitespace-nowrap px-5 text-xs font-semibold uppercase tracking-wide">
                  {campo.label}
                </TableHead>
              ))}
              <TableHead className="w-16 px-5 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((registro) => (
              <TableRow key={registro.id}>
                {area.campos.map((campo, index) => (
                  <TableCell key={campo.key} className="max-w-64 px-5 py-3.5">
                    <span className={index === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
                      {campo.key === "status" ? <StatusBadge status={areaKey === "estoque" ? statusDoEstoque(registro) : registro[campo.key] ?? ""} /> : campo.key === "porcentagem" ? `${registro[campo.key] ?? "0"}%` : registro[campo.key]}
                    </span>
                  </TableCell>
                ))}
                <TableCell className="px-5 text-right">
                  {areaKey === "estoque" ? (
                    <Button variant="ghost" size="icon" aria-label={`Editar ${registro["nome"]}`} onClick={() => setModal({ tipo: "editar", registro })}>
                      <Pencil />
                    </Button>
                  ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Ações de ${registro["nome"]}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setModal({ tipo: "ver", registro })}>
                        <Eye />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setModal({ tipo: "editar", registro })}>
                        <Pencil />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setModal({ tipo: "excluir", registro })}>
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
                <DialogDescription>Esta ação removerá "{modal.registro?.["nome"]}" dos registros.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModal(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (modal.registro) excluir(areaKey, modal.registro.id);
                    setModal(null);
                  }}
                >
                  Excluir
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={submit}>
              <DialogHeader>
                <DialogTitle>
                  {modal?.tipo === "ver" ? "Detalhes" : modal?.tipo === "editar" ? "Editar" : "Adicionar"} {area.singular}
                </DialogTitle>
                <DialogDescription>
                  {modal?.tipo === "ver" ? "Confira as informações deste registro." : "Preencha os dados abaixo. Os campos são obrigatórios."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6 sm:grid-cols-2">
                {area.campos.filter((campo) => !(areaKey === "estoque" && campo.key === "status")).map((campo, index) => (
                  <div key={campo.key} className={index === 0 ? "sm:col-span-2" : ""}>
                    <Label htmlFor={campo.key}>{campo.label}</Label>
                    {campo.options ? (
                      <select
                        id={campo.key}
                        name={campo.key}
                        defaultValue={modal?.registro?.[campo.key] ?? campo.options[0] ?? ""}
                        disabled={modal?.tipo === "ver" || (areaKey === "estoque" && campo.key === "nome")}
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
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">%</span>
                      </div>
                    ) : (
                      <Input
                        id={campo.key}
                        name={campo.key}
                        type={campo.type ?? "text"}
                        defaultValue={modal?.registro?.[campo.key] ?? ""}
                        disabled={modal?.tipo === "ver" || (areaKey === "estoque" && campo.key === "nome")}
                        required
                        className="mt-1.5"
                      />
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModal(null)}>
                  {modal?.tipo === "ver" ? "Fechar" : "Cancelar"}
                </Button>
                {modal?.tipo !== "ver" && <Button type="submit">Salvar</Button>}
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
