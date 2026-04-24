const WORDS_PER_MINUTE = 220;

export function computeReadTime(body: string | undefined, override?: string): string {
  if (override) return override;
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min`;
}
