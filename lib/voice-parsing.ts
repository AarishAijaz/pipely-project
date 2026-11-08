import type { Customer } from "@/components/customer-form-dialog";

// Speech recognizers return emails as spoken words, e.g.
// "jane dot cooper at acme dot com" -> "jane.cooper@acme.com"
export function parseSpokenEmail(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+at\s+/g, "@")
    .replace(/\s+dot\s+/g, ".")
    .replace(/\s+underscore\s+/g, "_")
    .replace(/\s+(dash|hyphen)\s+/g, "-")
    .replace(/\s+/g, "");
}

export function parseSpokenPhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function parseSpokenStatus(raw: string): Customer["status"] | null {
  const text = raw.trim().toLowerCase();
  if (text.includes("active")) return "Active";
  if (text.includes("lead")) return "Lead";
  if (text.includes("churn")) return "Churned";
  return null;
}
