import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "products";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "[supabase-storage] MISSING ENV VARS: NEXT_PUBLIC_SUPABASE_URL and/or " +
      "SUPABASE_SERVICE_ROLE_KEY are not set. All storage operations will fail."
  );
}

function getAdminClient() {
  return createClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getPublicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function uploadToStorage(
  buffer: ArrayBuffer,
  contentType: string,
  path: string
): Promise<string> {
  const supabase = getAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType, upsert: true });

  if (error) {
    console.error("[supabase-storage] upload error:", error);
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  return getPublicUrl(path);
}

export async function deleteFromStorage(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const supabase = getAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error("[supabase-storage] delete error:", error.message);
  }
}
