"use server";

import { revalidatePath } from "next/cache";
import { UPLOAD_BUCKET } from "@/lib/storage";
import { createServerClient } from "@/lib/supabase/server";

const MAX_TITLE_LENGTH = 100;

function readTitle(formData: FormData): string {
  const title = String(formData.get("title") ?? "").trim();
  if (!title || title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Der Titel muss 1 bis ${MAX_TITLE_LENGTH} Zeichen lang sein.`);
  }
  return title;
}

function readId(formData: FormData): string {
  return String(formData.get("id") ?? "");
}

export async function createNotebook(formData: FormData) {
  const { error } = await createServerClient()
    .from("notebooks")
    .insert({ title: readTitle(formData) });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function renameNotebook(formData: FormData) {
  const { error } = await createServerClient()
    .from("notebooks")
    .update({ title: readTitle(formData) })
    .eq("id", readId(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function deleteNotebook(formData: FormData) {
  const supabase = createServerClient();
  const id = readId(formData);

  // Dateien im Storage hängen nicht per Cascade am Notebook und müssen separat gelöscht werden
  const { data: files } = await supabase.storage.from(UPLOAD_BUCKET).list(id);
  if (files?.length) {
    await supabase.storage.from(UPLOAD_BUCKET).remove(files.map((f) => `${id}/${f.name}`));
  }

  const { error } = await supabase.from("notebooks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
