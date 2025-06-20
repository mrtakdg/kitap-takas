import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export default function AdminPanel() {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [info, setInfo] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			router.push("/login");
			return;
		}

		try {
			const decoded = jwt.decode(token);
			if (decoded.role !== "admin") {
				router.push("/");
				return;
			}

			setUser(decoded);
			fetchUsers(token);
		} catch (err) {
			console.error("Token hatası:", err);
			localStorage.removeItem("token");
			router.push("/login");
		}
	}, []);

	const fetchUsers = async (token) => {
		const res = await fetch("/api/admin/users", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await res.json();
		if (res.ok) {
			setUsers(data.users);
		} else {
			console.error("Kullanıcılar alınamadı:", data.message);
		}
	};

	const deleteUser = async (id) => {
		const token = localStorage.getItem("token");

		const res = await fetch("/api/admin/delete", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ id }),
		});

		if (res.ok) {
			setInfo("✅ Kullanıcı başarıyla silindi.");
			fetchUsers(token);
		} else {
			const data = await res.json();
			setInfo(`❌ Hata: ${data.message}`);
		}
	};

	const toggleRole = async (id, currentRole) => {
		const token = localStorage.getItem("token");

		if (id === user.id) {
			setInfo("❌ Admin kendi rolünü değiştiremez.");
			return;
		}

		const newRole = currentRole === "admin" ? "user" : "admin";

		const res = await fetch("/api/admin/role", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ id, role: newRole }),
		});

		const data = await res.json();

		if (res.ok) {
			const changedUser = users.find((u) => u.id === id);
			setInfo(
				`✅ ${changedUser?.email} kullanıcısının rolü "${newRole}" olarak değiştirildi.`
			);
			fetchUsers(token);
		} else {
			setInfo(`❌ ${data.message}`);
		}
	};

	if (!user) return null;

	return (
		<div className="container mt-5">
			<h2>🔐 Admin Panel</h2>

			{info && (
				<div className="alert alert-info text-center fw-semibold mt-3">
					{info}
				</div>
			)}

			<table className="table mt-4">
				<thead>
					<tr>
						<th>Email</th>
						<th>Rol</th>
						<th>İşlemler</th>
					</tr>
				</thead>
				<tbody>
					{users.map((u) => (
						<tr key={u.id}>
							<td>{u.email}</td>
							<td>{u.role}</td>
							<td>
								<button
									className="btn btn-sm btn-warning me-2"
									onClick={() => toggleRole(u.id, u.role)}
								>
									Rolü Değiştir
								</button>
								<button
									className="btn btn-sm btn-danger"
									onClick={() => deleteUser(u.id)}
								>
									Sil
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
