import React, { useState, useEffect } from "react";

export default function BookmarkForm({
  onAdd,
  editingBookmark,
  cancelEdit,
  predefinedTags,
}) {
  const [label, setLabel] = useState("");
  const [ip, setIp] = useState("");
  const [tags, setTags] = useState([]); // store tags as array
  const [customTagInput, setCustomTagInput] = useState("");

  // Fill form if editing
  useEffect(() => {
    if (editingBookmark) {
      setLabel(editingBookmark.label);
      setIp(editingBookmark.ip);
      setTags(editingBookmark.tags || []);
    } else {
      setLabel("");
      setIp("");
      setTags([]);
    }
  }, [editingBookmark]);

  // Toggle predefined tag selection
  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Add custom tag on Enter or comma
  const addCustomTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = customTagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setCustomTagInput("");
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label || !ip) return alert("Label and IP are required");
    onAdd({
      label,
      ip,
      tags,
    });
    // clear form
    setLabel("");
    setIp("");
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group full">
        <label>Label</label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Office Printer"
        />
      </div>

      <div className="form-group full">
        <label>IP Address / Link</label>
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="e.g. 192.168.1.15"
        />
      </div>

      <div className="form-group full">
        <label>Tags (click to select, or add custom)</label>
        <div className="tag-selector">
          {predefinedTags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`tag-btn ${tags.includes(tag) ? "active" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add custom tag and press Enter"
          value={customTagInput}
          onChange={(e) => setCustomTagInput(e.target.value)}
          onKeyDown={addCustomTag}
        />
      </div>

      <div className="form-actions">
        <button type="submit">{editingBookmark ? "Update" : "Add"}</button>
        {editingBookmark && (
          <button type="button" className="cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
