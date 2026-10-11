import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SourceList } from "@/components/source-list";
import { UploadForm } from "@/components/upload-form";
import { getNotebook } from "@/lib/notebooks";

async function NotebookView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notebook = await getNotebook(id);
  if (!notebook) notFound();

  return (
    <>
      <h1 className="text-3xl font-semibold">{notebook.title}</h1>
      <UploadForm notebookId={notebook.id} />
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium">Quellen</h2>
        <SourceList notebookId={notebook.id} />
      </section>
    </>
  );
}

export default function NotebookPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← Alle Notebooks
      </Link>
      <Suspense fallback={<p className="text-muted-foreground">Lade…</p>}>
        <NotebookView params={params} />
      </Suspense>
    </main>
  );
}
