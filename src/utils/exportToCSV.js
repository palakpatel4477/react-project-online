// src/utils/exportToCSV.js
export function exportToCSV(bookmarks) {
  const headers = ["Label", "URL", "Tags", "Notes"];
  const rows = bookmarks.map((b) => [b.label, b.url, b.tags, b.notes]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map((e) =>
        e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "bookmarks.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
