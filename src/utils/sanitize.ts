import DOMPurify from "dompurify";

const ALLOWED_TAGS = ["b"];

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS });
}
