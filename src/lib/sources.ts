import { createServerClient } from "@/lib/supabase/server";

export type Source = {
  id: string;
  name: string;
  type: "pdf" | "text";
  status: "pending" | "processed" | "error";
  error_message: string | null;
  selected: boolean;
};

export async function listSources(notebookId: string): Promise<Source[]> {
  const { data, error } = await createServerClient()
    .from("sources")
    .select("id, name, type, status, error_message, selected")
    .eq("notebook_id", notebookId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Quellen konnten nicht geladen werden: ${error.message}`);
  return data;
}
