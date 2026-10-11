import { createServerClient } from "@/lib/supabase/server";

export type Notebook = {
  id: string;
  title: string;
  created_at: string;
};

export async function listNotebooks(): Promise<Notebook[]> {
  const { data, error } = await createServerClient()
    .from("notebooks")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Notebooks konnten nicht geladen werden: ${error.message}`);
  return data;
}

export async function getNotebook(id: string): Promise<Notebook | null> {
  const { data, error } = await createServerClient()
    .from("notebooks")
    .select("id, title, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Notebook konnte nicht geladen werden: ${error.message}`);
  return data;
}
