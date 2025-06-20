import { useEffect, useState } from "react";

export default function AdminSwaps() {
	const [swaps, setSwaps] = useState([]);

	useEffect(() => {
		fetch("/api/admin/swaps")
			.then((res) => res.json())
			.then((data) => setSwaps(data.swaps));
	}, []);

	return (
		<div className="container mt-5">
			<h2 className="mb-4">🔁 Tüm Takas İstekleri (Admin)</h2>

			{swaps.length === 0 ? (
				<p className="text-muted">Henüz takas isteği yok.</p>
			) : (
				<ul className="list-group">
					{swaps.map((req) => (
						<li key={req.id} className="list-group-item">
							<div className="d-flex justify-content-between align-items-start">
								<div>
									<p className="mb-1">
										<strong>{req.fromUser.email}</strong> kullanıcısı,{" "}
										<strong>"{req.bookOffered.title}"</strong> kitabını{" "}
										<strong>"{req.bookWanted.title}"</strong> kitabıyla takas
										etmek istiyor.
									</p>
									<p className="mb-1">
										<em>Mesaj:</em>{" "}
										{req.message ? (
											req.message
										) : (
											<span className="text-muted">(mesaj yok)</span>
										)}
									</p>
									<small className="text-muted">
										Gönderildi: {new Date(req.createdAt).toLocaleString()}{" "}
										<br />
										Alıcı: <strong>{req.toUser.email}</strong>
									</small>
								</div>
								<div>
									{req.status === "pending" && (
										<span className="badge bg-warning text-dark">
											Beklemede
										</span>
									)}
									{req.status === "accepted" && (
										<span className="badge bg-success">Kabul Edildi</span>
									)}
									{req.status === "rejected" && (
										<span className="badge bg-danger">Reddedildi</span>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
