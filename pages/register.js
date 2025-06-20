import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export default function Register() {
	const router = useRouter();

	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwt.decode(token);
				if (decoded) {
					router.push("/");
				}
			} catch (err) {
				localStorage.removeItem("token");
			}
		}
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.message || "Kayıt başarısız.");
			} else {
				setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
				setTimeout(() => router.push("/login"), 2000);
			}
		} catch (err) {
			console.error("Kayıt hatası:", err);
			setError("Sunucu hatası. Lütfen tekrar deneyin.");
		}
	};

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
				<div
					className="p-4 shadow-lg"
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.95)",
						borderRadius: "1rem",
						width: "100%",
						maxWidth: "400px",
					}}
				>
					<h2
						className="text-center text-dark mb-4"
						style={{ fontWeight: 500 }}
					>
						🚀 Kayıt Ol
					</h2>

					{error && <div className="alert alert-danger">{error}</div>}
					{success && <div className="alert alert-success">{success}</div>}

					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label text-dark">Email</label>
							<input
								type="email"
								className="form-control"
								name="email"
								onChange={handleChange}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label text-dark">Şifre</label>
							<input
								type="password"
								className="form-control"
								name="password"
								onChange={handleChange}
								required
							/>
						</div>
						<div className="d-grid">
							<button className="btn btn-primary" type="submit">
								Kayıt Ol
							</button>
						</div>
					</form>

					<div className="text-center mt-3">
						<span className="text-dark">
							Zaten hesabınız var mı?{" "}
							<a href="/login" className="text-decoration-none fw-semibold">
								Giriş yap
							</a>
						</span>
					</div>
				</div>

				<footer className="text-light mt-5">
					<small>© 2025 Kitap Takas Uygulaması | Tüm Hakları Saklıdır.</small>
				</footer>
			</div>
		</div>
	);
}
