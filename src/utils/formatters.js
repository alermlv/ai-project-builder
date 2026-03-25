export function formatLabel(value) {
  if (!value) {
    return "-";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatTaskStatus(value) {
  if (!value) {
    return "Planned";
  }

  return formatLabel(value);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
