import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export default function Navbar() {
	const user = useSelector((state) => state.user.user);
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const decoded = jwt.decode(token);
				dispatch(setUser(decoded));
			} catch (err) {
				localStorage.removeItem("token");
				dispatch(clearUser());
			}
		}
	}, []);

	const handleLogout = async () => {
		await fetch("/api/logout");
		document.cookie = "token=; path=/; max-age=0";
		localStorage.removeItem("token");
		dispatch(clearUser());
		router.push("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
			<div className="container-fluid">
				<Link
					className="navbar-brand fw-bold d-flex align-items-center gap-2"
					href="/"
				>
					📚 <span>Kitap Takas</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div
					className="collapse navbar-collapse justify-content-end"
					id="navbarNav"
				>
					<div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center mt-3 mt-lg-0">
						{user ? (
							<>
								<Link className="btn btn-outline-dark" href="/swap">
									🔁 Takas Yap
								</Link>
								<Link className="btn btn-outline-success" href="/books">
									➕ Kitap Ekle
								</Link>
								{user.role === "admin" && (
									<>
										<Link className="btn btn-warning" href="/admin">
											🛠️ Admin Paneli
										</Link>
										<Link className="btn btn-success" href="/admin/swaps">
											📋 Tüm Takaslar
										</Link>
										<Link className="btn btn-sm btn-info" href="/admin/stats">
											📊 Kitap Raporu
										</Link>
									</>
								)}
								<Link className="btn btn-outline-secondary" href="/messages">
									Mesajlar
								</Link>
								<Link className="btn btn-outline-primary" href="/profile">
									Profil
								</Link>
								<button className="btn btn-danger" onClick={handleLogout}>
									Çıkış Yap
								</button>
							</>
						) : (
							<>
								<Link className="btn btn-outline-success" href="/login">
									Giriş
								</Link>
								<Link className="btn btn-primary" href="/register">
									Kayıt Ol
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
