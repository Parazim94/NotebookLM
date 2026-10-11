"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteNotebook, renameNotebook } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Notebook } from "@/lib/notebooks";

export function NotebookCard({ notebook }: { notebook: Notebook }) {
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-2">
        {editing ? (
          <form
            action={async (formData) => {
              await renameNotebook(formData);
              setEditing(false);
            }}
            className="flex flex-1 gap-2"
          >
            <input type="hidden" name="id" value={notebook.id} />
            <Input name="title" defaultValue={notebook.title} maxLength={100} required autoFocus />
            <Button type="submit">Speichern</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              Abbrechen
            </Button>
          </form>
        ) : (
          <>
            <Link href={`/notebooks/${notebook.id}`} className="flex-1 font-medium hover:underline">
              {notebook.title}
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(true)}>
                Umbenennen
              </Button>
              <form
                action={deleteNotebook}
                onSubmit={(e) => {
                  if (!confirm(`Notebook "${notebook.title}" und alle Quellen löschen?`)) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={notebook.id} />
                <Button type="submit" variant="destructive">
                  Löschen
                </Button>
              </form>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
