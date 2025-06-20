// imports aynı
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export default function Books() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const decoded = jwt.decode(token);
    setUser(decoded);

    fetch(`/api/books/user?userId=${decoded.id}`)
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = editId ? "/api/books/update" : "/api/books/add";
    const payload = {
      title,
      author,
      description,
      ...(editId ? { id: editId } : { ownerId: user.id }),
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(editId ? "📘 Kitap güncellendi." : "✅ Kitap eklendi.");
        setTitle("");
        setAuthor("");
        setDescription("");
        setEditId(null);
        fetch(`/api/books/user?userId=${user.id}`)
          .then((res) => res.json())
          .then((data) => setBooks(data));
      } else {
        setMessage("Hata: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Sunucu hatası.");
    }
  };

  const handleEdit = (book) => {
    setEditId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description || "");
    setMessage("✏️ Düzenleme modundasın");
  };

  return (
    <div className="container mt-5">
      <h2>📚 Kitaplarım</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Kitap Adı</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Yazar</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Açıklama</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          {editId ? "Güncelle" : "Kitap Ekle"}
        </button>
      </form>

      <h4 className="mt-4">📖 Eklediğin Kitaplar</h4>
      <ul className="list-group">
        {books.map((book) => (
          <li key={book.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{book.title}</strong> — {book.author}
              <br />
              {book.description}
              <br />
              <small className="text-muted">
                Eklenme: {new Date(book.createdAt).toLocaleString()}
              </small>
            </div>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(book)}>
              Düzenle
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
