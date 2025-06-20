import { useEffect, useState } from "react";

export default function AdminBooks() {
	const [books, setBooks] = useState([]);
	const [editId, setEditId] = useState(null);
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [description, setDescription] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("/api/admin/books")
			.then((res) => res.json())
			.then((data) => setBooks(data.books));
	}, []);

	const deleteBook = async (id) => {
		if (!confirm("Bu kitabı silmek istediğine emin misin?")) return;

		const res = await fetch("/api/admin/books/delete", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});

		if (res.ok) {
			setBooks(books.filter((b) => b.id !== id));
		} else {
			alert("Silme işlemi başarısız.");
		}
	};

	const handleEdit = (book) => {
		setEditId(book.id);
		setTitle(book.title);
		setAuthor(book.author);
		setDescription(book.description || "");
		setMessage("✏️ Düzenleme modundasın");
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		if (!editId) return;

		try {
			const res = await fetch("/api/books/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: editId, title, author, description }),
			});

			const data = await res.json();

			if (res.ok) {
				setBooks(books.map((b) => (b.id === editId ? data.book : b)));
				setEditId(null);
				setTitle("");
				setAuthor("");
				setDescription("");
				setMessage("✅ Kitap başarıyla güncellendi.");
			} else {
				setMessage("Hata: " + data.message);
			}
		} catch (err) {
			console.error(err);
			setMessage("Sunucu hatası.");
		}
	};

	const clearForm = () => {
		setEditId(null);
		setTitle("");
		setAuthor("");
		setDescription("");
		setMessage("");
	};

	return (
		<div className="container mt-5">
			<h2>📚 Kitap Yönetimi (Admin)</h2>

			{message && <div className="alert alert-info">{message}</div>}

			{editId && (
				<form onSubmit={handleUpdate} className="mb-4">
					<h5>Kitap Düzenle (ID: {editId})</h5>
					<div className="mb-2">
						<label className="form-label">Kitap Adı</label>
						<input
							type="text"
							className="form-control"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>
					<div className="mb-2">
						<label className="form-label">Yazar</label>
						<input
							type="text"
							className="form-control"
							value={author}
							onChange={(e) => setAuthor(e.target.value)}
							required
						/>
					</div>
					<div className="mb-2">
						<label className="form-label">Açıklama</label>
						<textarea
							className="form-control"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<button type="submit" className="btn btn-primary me-2">
						Güncelle
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={clearForm}
					>
						Temizle
					</button>
				</form>
			)}

			<ul className="list-group">
				{books.map((book) => (
					<li
						key={book.id}
						className="list-group-item d-flex justify-content-between align-items-start"
					>
						<div>
							<strong>{book.title}</strong> — {book.author}
							<br />
							<small className="text-muted">
								Ekleyen: {book.owner?.email || "Bilinmiyor"} |{" "}
								{new Date(book.createdAt).toLocaleString()}
							</small>
							<br />
							{book.description}
						</div>
						<div className="d-flex flex-column gap-2">
							<button
								className="btn btn-sm btn-outline-secondary"
								onClick={() => handleEdit(book)}
							>
								Düzenle
							</button>
							<button
								className="btn btn-sm btn-danger"
								onClick={() => deleteBook(book.id)}
							>
								Sil
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
