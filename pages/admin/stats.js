import { useEffect, useState } from "react";

export default function AdminStats() {
	const [stats, setStats] = useState([]);
	const [editingBook, setEditingBook] = useState(null);
	const [form, setForm] = useState({ title: "", author: "", description: "" });

	const fetchStats = async () => {
		const res = await fetch("/api/admin/stats");
		const data = await res.json();
		setStats(data.stats);
	};

	useEffect(() => {
		fetchStats();
	}, []);

	const handleDelete = async (id) => {
		if (!confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;
		await fetch("/api/admin/delete-book", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		});
		fetchStats();
	};

	const startEdit = (book) => {
		setEditingBook(book.id);
		setForm({
			title: book.title,
			author: book.author || "",
			description: book.description || "",
		});
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		await fetch("/api/admin/update-book", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: editingBook, ...form }),
		});
		setEditingBook(null);
		fetchStats();
	};

	return (
		<div className="container mt-5">
			<h2 className="mb-4">📊 Kullanıcı Kitap İstatistikleri</h2>

			{stats.map((user) => (
				<div
					key={user.email}
					className="mb-5 p-3 border rounded bg-light shadow-sm"
				>
					<h5 className="fw-bold mb-3 text-primary">👤 {user.email}</h5>

					{user.books.length === 0 ? (
						<p className="text-muted">Hiç kitabı yok.</p>
					) : (
						<div className="row g-3">
							{user.books.map((book) =>
								editingBook === book.id ? (
									<div className="col-md-6" key={book.id}>
										<div className="border rounded p-3 bg-white shadow-sm">
											<form onSubmit={handleUpdate}>
												<input
													className="form-control mb-2"
													value={form.title}
													onChange={(e) =>
														setForm({ ...form, title: e.target.value })
													}
													placeholder="Kitap Adı"
													required
												/>
												<input
													className="form-control mb-2"
													value={form.author}
													onChange={(e) =>
														setForm({ ...form, author: e.target.value })
													}
													placeholder="Yazar"
												/>
												<textarea
													className="form-control mb-2"
													value={form.description}
													onChange={(e) =>
														setForm({ ...form, description: e.target.value })
													}
													placeholder="Açıklama"
												/>
												<div className="d-flex gap-2">
													<button
														className="btn btn-success btn-sm"
														type="submit"
													>
														💾 Kaydet
													</button>
													<button
														className="btn btn-secondary btn-sm"
														type="button"
														onClick={() => setEditingBook(null)}
													>
														❌ Vazgeç
													</button>
												</div>
											</form>
										</div>
									</div>
								) : (
									<div className="col-md-6" key={book.id}>
										<div className="border rounded p-3 bg-white shadow-sm d-flex justify-content-between align-items-start">
											<div>
												<strong>{book.title}</strong> — <em>{book.author}</em>
												<br />
												<small className="text-muted">{book.description}</small>
											</div>
											<div className="ms-2 d-flex flex-column gap-1">
												<button
													className="btn btn-warning btn-sm"
													onClick={() => startEdit(book)}
												>
													✏️
												</button>
												<button
													className="btn btn-danger btn-sm"
													onClick={() => handleDelete(book.id)}
												>
													🗑️
												</button>
											</div>
										</div>
									</div>
								)
							)}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
