export default function BookmarkList({ bookmarks, onDelete, onEdit }) {
  if (bookmarks.length === 0) return <p>No bookmarks added yet.</p>;

  return (
    <div className="bookmark-list">
      {bookmarks.map((b, i) => (
        <div className="card" key={i}>
          <h3>{b.label}</h3>
          <p>
            <strong>URL:</strong>{" "}
            <a href={b.ip} target="_blank" rel="noreferrer">
              {b.ip}
            </a>
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            {Array.isArray(b.tags) ? b.tags.join(", ") : b.tags}
          </p>
          <p>
            <strong>Notes:</strong> {b.notes}
          </p>
          <button onClick={() => onEdit(i)}>Edit</button>
          <button onClick={() => onDelete(i)} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
