export const exportToCSV = (bookmarks) => {
  const csvRows = [
    ["Label", "IP", "Tags", "Notes"], // Added Notes header
    ...bookmarks.map((bookmark) => [
      bookmark.label,
      bookmark.ip,
      `"${bookmark.tags.join(",")}"`, // Tags wrapped in quotes
      `"${bookmark.notes ? bookmark.notes.replace(/"/g, '""') : ""}"`, // Notes wrapped and quotes escaped
    ]),
  ];

  const csvContent = csvRows.map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "bookmarks.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
