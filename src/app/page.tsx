import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">NotebookLM-Klon</h1>
      <p className="text-muted-foreground">
        Quellen hochladen und Fragen mit Zitaten stellen.
      </p>
      <Button>Los geht&apos;s</Button>
    </main>
  );
}
