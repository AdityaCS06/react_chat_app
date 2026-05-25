import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PROFILE_BUCKET = "profile_images";

export function getProfileImagePath(userId, filename = "avatar.jpg") {
  return `${userId}/${filename}`;
}

export async function uploadProfileImage(file, userId) {
  const path = getProfileImagePath(userId);
  const { error } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return path;
}

export async function cleanupProfileImages(userId) {
  const { data: files, error: listError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .list(userId);
  if (listError) throw listError;
  if (!files?.length) return;

  const paths = files.map((f) => `${userId}/${f.name}`);
  const { error: removeError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .remove(paths);
  if (removeError) throw removeError;
}

export function getProfileImageUrl(userId) {
  const path = getProfileImagePath(userId);
  const { data } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
