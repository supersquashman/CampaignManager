/** "a, b ,c" -> ["a", "b", "c"] */
export function splitList(raw: string): string[] {
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** "" -> undefined (so JSON.stringify drops it), otherwise the number. */
export function optionalNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  return trimmed === '' ? undefined : Number(trimmed);
}
