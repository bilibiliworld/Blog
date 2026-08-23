export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export function normalizeTag(tag: string) {
  return tag.trim().normalize('NFC').toLowerCase();
}

export function tagSegment(tag: string) {
  return normalizeTag(tag)
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]/gu, '');
}
