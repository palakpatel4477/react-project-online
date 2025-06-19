import React, { useState, useEffect } from "react";
import BookmarkForm from "./BookmarkForm";
import BookmarkList from "./BookmarkList";
import { exportToCSV } from "./utils/exportToCSV";
import Papa from "papaparse";

export default function App() {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const predefinedTags = [
    "network",
    "printer",
    "server",
    "vpn",
    "software",
    "hardware",
    "database",
    "urgent",
  ];

  const [editingIndex, setEditingIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  // Generate all tags including "All"
  const allTags = bookmarks.flatMap((b) => {
    if (Array.isArray(b.tags)) {
      return b.tags;
    } else if (typeof b.tags === "string") {
      return b.tags.split(",").map((t) => t.trim());
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const parsed = results.data.map((row) => ({
          label: row.Label?.trim(),
          ip: row.IP?.trim(),
          tags:
            typeof row.Tags === "string"
              ? row.Tags.replace(/^"|"$/g, "")
                  .split(",")
                  .map((t) => t.trim())
              : [],
          notes: row.Notes ? row.Notes.trim() : "",
        }));

        const shouldMerge = window.confirm("Merge with existing bookmarks?");
        const newBookmarks = shouldMerge ? [...bookmarks, ...parsed] : parsed;

        setBookmarks(newBookmarks);
        alert("Bookmarks imported from CSV!");
      },
      error: function (err) {
        alert("CSV Parse Error: " + err.message);
      },
    });
  };

  // Add or update bookmark
  const addOrUpdateBookmark = (bookmark) => {
    console.log("Bookmark to add/update:", bookmark); // check if 'ip' exists here

    if (editingIndex !== null) {
      const updated = [...bookmarks];
      updated[editingIndex] = bookmark;
      setBookmarks(updated);
      setEditingIndex(null);
    } else {
      setBookmarks([bookmark, ...bookmarks]);
    }
  };

  // Delete bookmark by index
  const deleteBookmark = (index) => {
    const newBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(newBookmarks);
  };

  // Start editing a bookmark
  const startEditBookmark = (index) => {
    setEditingIndex(index);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingIndex(null);
  };

  // Filtering bookmarks based on search text and active tag
  const filteredBookmarks = bookmarks.filter((b) => {
    const searchTerm = searchText.toLowerCase();

    return (
      b.label.toLowerCase().includes(searchTerm) ||
      b.ip.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="main-layout">
      <div className="sidebar">
        <h1>IP & Tools</h1>
        <BookmarkForm
          onAdd={addOrUpdateBookmark}
          editingBookmark={
            editingIndex !== null ? bookmarks[editingIndex] : null
          }
          cancelEdit={cancelEdit}
          predefinedTags={predefinedTags}
        />
      </div>

      <div className="content">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="tag-filter">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-btn ${activeTag === tag ? "active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="import-export-controls">
          <button className="export-btn" onClick={() => exportToCSV(bookmarks)}>
            📤 Export CSV
          </button>

          <label className="import-btn">
            📥 Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              hidden
            />
          </label>
        </div>

        <BookmarkList
          bookmarks={filteredBookmarks}
          onDelete={deleteBookmark}
          onEdit={startEditBookmark}
        />
      </div>
    </div>
  );
}
