import React, { useState, useEffect } from "react";
import BookmarkForm from "./BookmarkForm";
import BookmarkList from "./BookmarkList";
import { exportToCSV } from "./utils/exportToCSV";

export default function App() {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const allTags = [
    "All",
    ...new Set(
      bookmarks
        .flatMap((b) => b.tags.split(",").map((t) => t.trim()))
        .filter((t) => t !== "")
    ),
  ];

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addOrUpdateBookmark = (bookmark) => {
    if (editingIndex !== null) {
      const updated = [...bookmarks];
      updated[editingIndex] = bookmark;
      setBookmarks(updated);
      setEditingIndex(null);
    } else {
      setBookmarks([bookmark, ...bookmarks]);
    }
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesSearch =
      b.label.toLowerCase().includes(searchText.toLowerCase()) ||
      b.tags.toLowerCase().includes(searchText.toLowerCase());

    const matchesTag =
      activeTag === "All" ||
      b.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .includes(activeTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const deleteBookmark = (index) => {
    const newBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(newBookmarks);
  };

  const startEditBookmark = (index) => {
    setEditingIndex(index);
  };

  return (
    <div className="container">
      <h1>🔗 IP & Tools Bookmarking App</h1>
      <input
        type="text"
        placeholder="Search bookmarks by label or tags..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />
      <BookmarkForm
        onAdd={addOrUpdateBookmark}
        editingBookmark={editingIndex !== null ? bookmarks[editingIndex] : null}
        cancelEdit={() => setEditingIndex(null)}
      />
      <div style={{ marginBottom: "1rem" }}>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            style={{
              marginRight: "8px",
              backgroundColor: activeTag === tag ? "#0077cc" : "#ddd",
              color: activeTag === tag ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <BookmarkList
        bookmarks={filteredBookmarks}
        onDelete={deleteBookmark}
        onEdit={startEditBookmark}
      />

      <button
        onClick={() => exportToCSV(bookmarks)}
        style={{
          marginBottom: "1rem",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📤 Export CSV
      </button>
    </div>
  );
}
