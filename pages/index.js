import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

export default function Home() {
	const [user, setUser] = useState(null);
	const [books, setBooks] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const decoded = jwt.decode(token);
			setUser(decoded);

			fetch("/api/admin/books")
				.then((res) => res.json())
				.then((data) => setBooks(data.books));
		} catch (err) {
			console.error("Token çözümleme hatası:", err);
		}
	}, []);

	return (
		<div
			style={{
				minHeight: "100vh",
				backgroundImage:
					"linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/kitap-bg.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-white px-3">
				<div className="mb-4 text-center">
					<div style={{ fontSize: "4rem" }}>📚</div>
					<h1 className="display-4 fw-bold text-white mt-2">
						Kitap Takas Platformu
					</h1>
					<p className="lead text-light">
						Ellerinizdeki kitapları değerlendirin, başkalarıyla değişin!
					</p>
				</div>

				{!user && (
					<div
						className="p-4 shadow-lg"
						style={{
							backgroundColor: "rgba(255, 255, 255, 0.9)",
							borderRadius: "1rem",
							maxWidth: "700px",
							width: "100%",
							backdropFilter: "blur(10px)",
						}}
					>
						<h5 className="text-dark text-center mb-3">📘 Uygulama Hakkında</h5>
						<p className="text-dark">
							Bu platform, kullanıcıların artık okumadığı kitapları başkalarıyla
							takas etmesini sağlar. Her kullanıcı giriş yapabilir,
							mesajlaşabilir ve kitap alışverişi yapabilir.
						</p>
						<p className="text-dark">
							Uygulama, modern arayüzü ve güvenli kimlik doğrulamasıyla sade ve
							kullanışlıdır.
						</p>
						<div className="d-flex justify-content-center gap-3 mt-4">
							<a
								href="/register"
								className="btn btn-primary btn-lg px-4 shadow"
							>
								{" "}
								🚀 Kayıt Ol
							</a>
							<a
								href="/login"
								className="btn btn-outline-success btn-lg px-4 shadow"
							>
								🔐 Giriş Yap
							</a>
						</div>
					</div>
				)}

				{user && (
					<div
						className="p-4 mt-4 shadow-lg bg-white text-dark"
						style={{ borderRadius: "1rem", width: "90%", maxWidth: "1000px" }}
					>
						<h3 className="mb-3">📚 Tüm Kullanıcıların Eklediği Kitaplar</h3>
						{books.length === 0 ? (
							<p className="text-muted">Henüz kitap eklenmemiş.</p>
						) : (
							<div className="row">
								{books.map((book) => (
									<div key={book.id} className="col-md-4 mb-4">
										<div className="card h-100 shadow-sm">
											<div className="card-body">
												<h5 className="card-title">{book.title}</h5>
												<h6 className="card-subtitle mb-2 text-muted">
													{book.author}
												</h6>
												<p className="card-text">
													{book.description || "Açıklama yok."}
												</p>
												<small className="text-muted">
													Ekleyen: {book.owner?.email || "Bilinmiyor"}
													<br />
													{new Date(book.createdAt).toLocaleString()}
												</small>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				<footer className="text-light mt-5">
					<small>© 2025 Kitap Takas Uygulaması | Tüm Hakları Saklıdır.</small>
				</footer>
			</div>
		</div>
	);
}
