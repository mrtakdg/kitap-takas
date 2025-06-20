import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function Profile() {
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.user);

	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			router.push("/login");
			return;
		}

		try {
			const decoded = jwt.decode(token);
			dispatch(setUser(decoded));

			// ✅ Veritabanından en güncel kullanıcı bilgilerini çek
			fetch(`/api/get-profile?id=${decoded.id}`)
				.then((res) => res.json())
				.then((data) => {
					if (data) {
						dispatch(setUser(data));
						setFirstName(data.firstName || "");
						setLastName(data.lastName || "");
						setAddress(data.address || "");
						setPhone(data.phone || "");
					}
				});
		} catch (err) {
			localStorage.removeItem("token");
			router.push("/login");
		}
	}, []);

	if (!user) return null;

	const handlePasswordChange = async (e) => {
		e.preventDefault();
		setMessage("");

		try {
			const res = await fetch("/api/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: user.email,
					password,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setMessage("Hata: " + data.message);
			} else {
				setMessage("✅ Şifre başarıyla güncellendi!");
				setPassword("");
			}
		} catch (err) {
			console.error(err);
			setMessage("Sunucu hatası, lütfen tekrar deneyin.");
		}
	};

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/update-profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: user.id,
					firstName,
					lastName,
					address,
					phone,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				alert("Hata: " + data.message);
			} else {
				const updatedRes = await fetch(`/api/get-profile?id=${user.id}`);
				const updatedUser = await updatedRes.json();

				if (updatedRes.ok) {
					dispatch(setUser(updatedUser));
					setFirstName(updatedUser.firstName || "");
					setLastName(updatedUser.lastName || "");
					setAddress(updatedUser.address || "");
					setPhone(updatedUser.phone || "");
					setMessage("✅ Profil bilgileri güncellendi!");
				}
			}
		} catch (err) {
			console.error(err);
			alert("Sunucu hatası.");
		}
	};

	return (
		<div className="container mt-5">
			<h2>👤 Profil Sayfası</h2>
			<p>
				<strong>Email:</strong> {user.email}
			</p>

			<hr />
			<h4>📝 Bilgilerini Güncelle</h4>
			{message && <div className="alert alert-info">{message}</div>}
			<form onSubmit={handleProfileUpdate}>
				<div className="mb-3">
					<label className="form-label">Ad</label>
					<input
						type="text"
						className="form-control"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Soyad</label>
					<input
						type="text"
						className="form-control"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Adres</label>
					<textarea
						className="form-control"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Telefon</label>
					<input
						type="text"
						className="form-control"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<button className="btn btn-primary" type="submit">
					Kaydet
				</button>
			</form>

			<hr />
			<h4>🔐 Şifreyi Değiştir</h4>
			<form onSubmit={handlePasswordChange}>
				<div className="mb-3">
					<label className="form-label">Yeni Şifre</label>
					<input
						type="password"
						className="form-control"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button className="btn btn-warning" type="submit">
					Şifreyi Güncelle
				</button>
			</form>
		</div>
	);
}
