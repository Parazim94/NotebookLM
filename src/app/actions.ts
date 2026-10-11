"use server";

import { revalidatePath } from "next/cache";
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
  const { error } = await createServerClient()
    .from("notebooks")
    .delete()
    .eq("id", readId(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
