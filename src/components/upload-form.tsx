"use client";

import { useActionState } from "react";
import { uploadSource, type UploadState } from "@/app/upload-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UploadForm({ notebookId }: { notebookId: string }) {
  const [state, action, pending] = useActionState<UploadState, FormData>(
    uploadSource.bind(null, notebookId),
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10">
      <h2 className="font-medium">Quelle hinzufügen</h2>
      <Input type="file" name="file" accept=".pdf,.txt,.md" />
      <p className="text-sm text-muted-foreground">oder Text einfügen:</p>
      <Input name="name" placeholder="Name (optional)" maxLength={100} />
      <textarea
        name="text"
        rows={4}
        placeholder="Text hier einfügen…"
        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Lade hoch…" : "Hinzufügen"}
        </Button>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      </div>
    </form>
  );
}
