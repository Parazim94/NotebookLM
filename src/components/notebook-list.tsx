import { NotebookCard } from "@/components/notebook-card";
import { listNotebooks } from "@/lib/notebooks";

export async function NotebookList() {
  const notebooks = await listNotebooks();

  if (notebooks.length === 0) {
    return <p className="text-muted-foreground">Noch keine Notebooks. Leg das erste an.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {notebooks.map((notebook) => (
        <NotebookCard key={notebook.id} notebook={notebook} />
      ))}
    </div>
  );
}
