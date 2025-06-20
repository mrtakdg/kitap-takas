import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export default function SwapPage() {
	const [user, setUser] = useState(null);
	const [myBooks, setMyBooks] = useState([]);
	const [allBooks, setAllBooks] = useState([]);
	const [bookOfferedId, setBookOfferedId] = useState("");
	const [bookWantedId, setBookWantedId] = useState("");
	const [message, setMessage] = useState("");
	const [inbox, setInbox] = useState([]);
	const [sent, setSent] = useState([]);
	const [info, setInfo] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return (window.location.href = "/login");

		const decoded = jwt.decode(token);
		setUser(decoded);

		fetch(`/api/books/user?userId=${decoded.id}`)
			.then((res) => res.json())
			.then((data) => setMyBooks(data));

		fetch("/api/admin/books")
			.then((res) => res.json())
			.then((data) => {
				const others = data.books.filter((b) => b.owner?.id !== decoded.id);
				setAllBooks(others);
			});

		fetch(`/api/swap/inbox?userId=${decoded.id}`)
			.then((res) => res.json())
			.then((data) => setInbox(data.swaps));

		fetch(`/api/swap/sent?userId=${decoded.id}`)
			.then((res) => res.json())
			.then((data) => setSent(data.swaps));
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setInfo("");

		const toBook = allBooks.find((b) => b.id == bookWantedId);
		if (!toBook) return setInfo("Geçersiz kitap seçimi.");

		const res = await fetch("/api/swap/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				fromUserId: user.id,
				toUserId: toBook.owner.id,
				bookOfferedId: parseInt(bookOfferedId),
				bookWantedId: parseInt(bookWantedId),
				message,
			}),
		});

		if (res.ok) {
			setInfo("✅ Takas isteği gönderildi!");
			setBookOfferedId("");
			setBookWantedId("");
			setMessage("");

			fetch(`/api/swap/sent?userId=${user.id}`)
				.then((res) => res.json())
				.then((data) => setSent(data.swaps));
		} else {
			setInfo("❌ Gönderim başarısız.");
		}
	};

	const respondSwap = async (id, status) => {
		const res = await fetch("/api/swap/respond", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, status }),
		});

		if (res.ok) {
			setInbox(inbox.map((s) => (s.id === id ? { ...s, status } : s)));
		} else {
			alert("İşlem başarısız.");
		}
	};

	return (
		<div className="container mt-5">
			<h2>🔁 Takas Gönder</h2>

			{info && <div className="alert alert-info">{info}</div>}

			<form onSubmit={handleSubmit} className="mb-5">
				<div className="mb-3">
					<label className="form-label">Kendi Kitabın</label>
					<select
						className="form-select"
						value={bookOfferedId}
						onChange={(e) => setBookOfferedId(e.target.value)}
						required
					>
						<option value="">Seç</option>
						{myBooks.map((book) => (
							<option key={book.id} value={book.id}>
								{book.title} — {book.author}
							</option>
						))}
					</select>
				</div>

				<div className="mb-3">
					<label className="form-label">Takas Etmek İstediğin Kitap</label>
					<select
						className="form-select"
						value={bookWantedId}
						onChange={(e) => setBookWantedId(e.target.value)}
						required
					>
						<option value="">Seç</option>
						{allBooks.map((book) => (
							<option key={book.id} value={book.id}>
								{book.title} — {book.author} ({book.owner?.email})
							</option>
						))}
					</select>
				</div>

				<div className="mb-3">
					<label className="form-label">Mesaj (isteğe bağlı)</label>
					<textarea
						className="form-control"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</div>

				<button className="btn btn-primary" type="submit">
					Takas İsteği Gönder
				</button>
			</form>

			{/* Accordion */}
			<div className="accordion mb-5" id="swapAccordion">
				{/* Gelen */}
				<div className="accordion-item">
					<h2 className="accordion-header" id="headingInbox">
						<button
							className="accordion-button"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseInbox"
							aria-expanded="true"
							aria-controls="collapseInbox"
						>
							📥 Gelen Takas İstekleri ({inbox.length})
						</button>
					</h2>
					<div
						id="collapseInbox"
						className="accordion-collapse collapse show"
						aria-labelledby="headingInbox"
						data-bs-parent="#swapAccordion"
					>
						<div className="accordion-body">
							{inbox.length === 0 ? (
								<p className="text-muted">Henüz gelen teklif yok.</p>
							) : (
								<ul className="list-group">
									{inbox.map((req) => (
										<li key={req.id} className="list-group-item">
											<strong>{req.fromUser.email}</strong>,{" "}
											<strong>{req.bookOffered.title}</strong> kitabını{" "}
											<strong>{req.bookWanted.title}</strong> ile takas etmek
											istiyor.
											<br />
											<em>{req.message}</em>
											<br />
											<small>{new Date(req.createdAt).toLocaleString()}</small>
											<br />
											<strong>Durum:</strong> {req.status}
											{req.status === "pending" && (
												<div className="mt-2 d-flex gap-2">
													<button
														className="btn btn-sm btn-success"
														onClick={() => respondSwap(req.id, "accepted")}
													>
														Kabul Et
													</button>
													<button
														className="btn btn-sm btn-danger"
														onClick={() => respondSwap(req.id, "rejected")}
													>
														Reddet
													</button>
												</div>
											)}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>

				{/* Gönderilen */}
				<div className="accordion-item">
					<h2 className="accordion-header" id="headingSent">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseSent"
							aria-expanded="false"
							aria-controls="collapseSent"
						>
							📤 Gönderdiğin Takas İstekleri ({sent.length})
						</button>
					</h2>
					<div
						id="collapseSent"
						className="accordion-collapse collapse"
						aria-labelledby="headingSent"
						data-bs-parent="#swapAccordion"
					>
						<div className="accordion-body">
							{sent.length === 0 ? (
								<p className="text-muted">Gönderdiğin takas isteği yok.</p>
							) : (
								<ul className="list-group">
									{sent.map((req) => (
										<li key={req.id} className="list-group-item">
											<strong>{req.bookOffered.title}</strong> kitabını{" "}
											<strong>{req.toUser.email}</strong> kişisine karşılık{" "}
											<strong>{req.bookWanted.title}</strong> ile teklif ettin.
											<br />
											<em>{req.message}</em>
											<br />
											<small>{new Date(req.createdAt).toLocaleString()}</small>
											<br />
											<strong>Durum:</strong> {req.status}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
