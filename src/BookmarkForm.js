import React, { useState, useEffect } from "react";

export default function BookmarkForm({ onAdd, editingBookmark, cancelEdit }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editingBookmark) {
      setLabel(editingBookmark.label);
      setUrl(editingBookmark.url);
      setTags(editingBookmark.tags);
      setNotes(editingBookmark.notes);
    } else {
      setLabel("");
      setUrl("");
      setTags("");
      setNotes("");
    }
  }, [editingBookmark]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ label, url, tags, notes });
    if (!editingBookmark) {
      // Clear form on add
      setLabel("");
      setUrl("");
      setTags("");
      setNotes("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        placeholder="Label (e.g., NAS Panel)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        required
      />
      <input
        placeholder="URL/IP (e.g., http://192.168.0.30:5000)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        placeholder="Tags (e.g., storage, switch)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit">{editingBookmark ? "Save" : "Add"} Bookmark</button>
      {editingBookmark && (
        <button
          type="button"
          onClick={cancelEdit}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
