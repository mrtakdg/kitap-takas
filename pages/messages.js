import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export default function Messages() {
	const router = useRouter();

	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [inbox, setInbox] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		try {
			const decoded = jwt.decode(token);
			if (!decoded || !decoded.id) throw new Error("Geçersiz token");

			setUser(decoded);

			fetch(`/api/users/for-messages`)
				.then((res) => res.json())
				.then((data) => {
					if (Array.isArray(data.users)) {
						const filtered = data.users.filter((u) => u.id !== decoded.id);
						setUsers(filtered);
					} else {
						console.warn("Kullanıcı listesi alınamadı:", data);
					}
				});

			// Gelen kutusunu getir
			fetch(`/api/message/inbox?userId=${decoded.id}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.messages) {
						setInbox(data.messages);
					} else {
						console.warn("Mesaj alınamadı:", data);
					}
				});
		} catch (err) {
			console.error("Token çözülemedi:", err);
			localStorage.removeItem("token");
			router.push("/login");
		}
	}, []);

	const handleSend = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch("/api/message/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fromId: user.id,
					toId: parseInt(selectedUser),
					content: message,
				}),
			});

			if (res.ok) {
				alert("Mesaj gönderildi");
				setMessage("");
			} else {
				const data = await res.json();
				alert("Hata: " + data.message);
			}
		} catch (err) {
			console.error("Gönderme hatası:", err);
			alert("Sunucu hatası.");
		}
	};

	if (!user) return <div className="container mt-5">Giriş yapmalısınız.</div>;

	return (
		<div className="container mt-5">
			<h2>📨 Mesaj Gönder</h2>
			<form onSubmit={handleSend}>
				<div className="mb-3">
					<label className="form-label">Kime</label>
					<select
						className="form-select"
						value={selectedUser}
						onChange={(e) => setSelectedUser(e.target.value)}
						required
					>
						<option value="">Kullanıcı seç</option>
						{users.map((u) => (
							<option key={u.id} value={u.id}>
								{u.email}
							</option>
						))}
					</select>
				</div>

				<div className="mb-3">
					<label className="form-label">Mesaj</label>
					<textarea
						className="form-control"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					/>
				</div>

				<button type="submit" className="btn btn-primary">
					Gönder
				</button>
			</form>

			<hr />
			<h4>📥 Gelen Kutusu</h4>
			{inbox.length === 0 ? (
				<p>Henüz mesaj yok.</p>
			) : (
				<ul className="list-group">
					{inbox.map((msg) => (
						<li key={msg.id} className="list-group-item">
							<strong>{msg.from?.email}:</strong> {msg.content}
							<br />
							<small className="text-muted">
								{new Date(msg.createdAt).toLocaleString()}
							</small>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
