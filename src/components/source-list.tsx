import { listSources } from "@/lib/sources";

const STATUS_LABEL = {
  pending: "Wartet auf Verarbeitung",
  processed: "Verarbeitet",
  error: "Fehler",
} as const;

export async function SourceList({ notebookId }: { notebookId: string }) {
  const sources = await listSources(notebookId);

  if (sources.length === 0) {
    return <p className="text-muted-foreground">Noch keine Quellen.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {sources.map((source) => (
        <li key={source.id} className="flex items-center justify-between rounded-lg p-3 ring-1 ring-foreground/10">
          <span className="font-medium">{source.name}</span>
          <span className="text-sm text-muted-foreground">{STATUS_LABEL[source.status]}</span>
        </li>
      ))}
    </ul>
  );
}
