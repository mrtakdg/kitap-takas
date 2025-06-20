import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
	const token = req.cookies.get("token")?.value;

	if (!token) {
		console.log("⛔ Token yok");
		return NextResponse.redirect(new URL("/", req.url));
	}

	try {
		const decoded = jwt.decode(token); // ✅ decode kullanıyoruz
		console.log("🧩 Token decode:", decoded);

		if (!decoded || decoded.role !== "admin") {
			console.log("⛔ Admin değil");
			return NextResponse.redirect(new URL("/", req.url));
		}

		return NextResponse.next();
	} catch (err) {
		console.log("⛔ Decode hatası:", err);
		return NextResponse.redirect(new URL("/", req.url));
	}
}

export const config = {
	matcher: ["/admin", "/admin/:path*"],
};
