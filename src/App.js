import React, { useState, useEffect } from "react";
import BookmarkForm from "./BookmarkForm";
import BookmarkList from "./BookmarkList";
import { exportToCSV } from "./utils/exportToCSV";

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
  const allTags = [
    "All",
    ...Array.from(
      new Set(
        bookmarks
          .flatMap((b) => b.tags.split(",").map((t) => t.trim()))
          .filter((t) => t !== "")
      )
    ),
  ];

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Add or update bookmark
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

        <button className="export-btn" onClick={() => exportToCSV(bookmarks)}>
          📤 Export CSV
        </button>

        <BookmarkList
          bookmarks={filteredBookmarks}
          onDelete={deleteBookmark}
          onEdit={startEditBookmark}
        />
      </div>
    </div>
  );
}
