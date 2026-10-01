import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Stethoscope } from "lucide-react";
import { CrudPage } from "@/components/gestao/crud-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/cadastros")({
  head: () => ({
    meta: [
      { title: "Cadastros - HemoHelp Sistema" },
      { name: "description", content: "Cadastro de doadores e agentes de saude." },
      { property: "og:title", content: "Cadastros - HemoHelp Sistema" },
      { property: "og:description", content: "Cadastro de doadores e agentes de saude." },
    ],
  }),
  component: CadastrosPage,
});

function CadastrosPage() {
  return (
    <Tabs defaultValue="doadores" className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Cadastros</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gerencie doadores e agentes de saude em um unico espaco.
          </p>
        </div>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="doadores" className="gap-2">
            <HeartHandshake className="size-4" />
            Doadores
          </TabsTrigger>
          <TabsTrigger value="agentes" className="gap-2">
            <Stethoscope className="size-4" />
            Agentes
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="doadores" className="mt-0">
        <CrudPage areaKey="doadores" />
      </TabsContent>
      <TabsContent value="agentes" className="mt-0">
        <CrudPage areaKey="agentes" />
      </TabsContent>
    </Tabs>
  );
}
