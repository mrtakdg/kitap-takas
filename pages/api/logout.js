import { serialize } from "cookie";

export default function handler(req, res) {
	res.setHeader(
		"Set-Cookie",
		serialize("token", "", {
			path: "/",
			httpOnly: true,
			maxAge: 0,
		})
	);

	res.status(200).json({ message: "Çıkış yapıldı" });
}
