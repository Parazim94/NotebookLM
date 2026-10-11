import { Suspense } from "react";
import { createNotebook } from "@/app/actions";
import { NotebookList } from "@/components/notebook-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-3xl font-semibold">Notebooks</h1>
      <form action={createNotebook} className="flex gap-2">
        <Input name="title" placeholder="Titel des neuen Notebooks" maxLength={100} required />
        <Button type="submit">Anlegen</Button>
      </form>
      <Suspense fallback={<p className="text-muted-foreground">Lade Notebooks…</p>}>
        <NotebookList />
      </Suspense>
    </main>
  );
}
