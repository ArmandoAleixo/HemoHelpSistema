import loadingImage from "@/images/TelaLoadingImagem.png";

export function LoadingScreen() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-6"
      aria-label="Carregando o HemoHelp"
      aria-busy="true"
    >
      <img src={loadingImage} alt="HemoHelp" className="w-full max-w-xl object-contain" />
      <div className="flex w-full max-w-xs flex-col items-center gap-3 text-sm font-medium text-slate-500">
        <span
          className="size-4 animate-spin rounded-full border-2 border-blue-100 border-t-blue-700"
          aria-hidden="true"
        />
        Carregando o sistema...
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-blue-100"
          role="progressbar"
          aria-label="Carregando"
          aria-valuetext="Carregando o sistema"
        >
          <div className="loading-bar-progress h-full w-2/5 rounded-full bg-blue-700" />
        </div>
      </div>
    </main>
  );
}
