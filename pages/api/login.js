import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email ve şifre zorunludur." });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ message: "Kullanıcı bulunamadı." });
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(401).json({ message: "Şifre hatalı." });
		}

		const token = signToken({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		res.setHeader(
			"Set-Cookie",
			serialize("token", token, {
				path: "/",
				httpOnly: true,
				maxAge: 60 * 60 * 24,
			})
		);

		res.status(200).json({
			token,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Giriş hatası:", error);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
