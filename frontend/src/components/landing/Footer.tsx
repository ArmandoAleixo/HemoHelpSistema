export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} HemoHelp. Doe sangue, salve vidas.
      </div>
    </footer>
  );
}
