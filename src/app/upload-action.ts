"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { MAX_UPLOAD_BYTES, UPLOAD_BUCKET } from "@/lib/storage";

export type UploadState = { error?: string; success?: boolean };

const FILE_TYPES: Record<string, { type: "pdf" | "text"; contentType: string }> = {
  pdf: { type: "pdf", contentType: "application/pdf" },
  txt: { type: "text", contentType: "text/plain" },
  md: { type: "text", contentType: "text/markdown" },
};

export async function uploadSource(
  notebookId: string,
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const file = formData.get("file");
  const pastedText = String(formData.get("text") ?? "").trim();

  let name: string;
  let ext: string;
  let body: Blob;

  if (file instanceof File && file.size > 0) {
    ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!(ext in FILE_TYPES)) return { error: "Erlaubt sind nur PDF-, TXT- und MD-Dateien." };
    name = file.name;
    body = file;
  } else if (pastedText) {
    ext = "txt";
    name = String(formData.get("name") ?? "").trim() || "Eingefügter Text";
    body = new Blob([pastedText], { type: "text/plain" });
  } else {
    return { error: "Wähle eine Datei oder füge einen Text ein." };
  }

  if (body.size > MAX_UPLOAD_BYTES) {
    return { error: `Die Quelle darf höchstens ${MAX_UPLOAD_BYTES / 1024 / 1024} MB groß sein.` };
  }

  const supabase = createServerClient();
  const { type, contentType } = FILE_TYPES[ext];
  // Eigener Dateiname im Storage: vermeidet Sonderzeichen und Kollisionen
  const storagePath = `${notebookId}/${crypto.randomUUID()}.${ext}`;

  const upload = await supabase.storage.from(UPLOAD_BUCKET).upload(storagePath, body, { contentType });
  if (upload.error) return { error: `Upload fehlgeschlagen: ${upload.error.message}` };

  const insert = await supabase
    .from("sources")
    .insert({ notebook_id: notebookId, name, type, storage_path: storagePath });
  if (insert.error) {
    await supabase.storage.from(UPLOAD_BUCKET).remove([storagePath]);
    return { error: `Quelle konnte nicht gespeichert werden: ${insert.error.message}` };
  }

  revalidatePath(`/notebooks/${notebookId}`);
  return { success: true };
}
