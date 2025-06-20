import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email ve şifre zorunludur." });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return res.status(400).json({ message: "Bu email zaten kayıtlı." });
		}

		const hashed = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: { email, password: hashed },
		});

		res.status(200).json({
			message: "Kayıt başarılı",
			user: { id: user.id, email: user.email },
		});
	} catch (error) {
		console.error("Kayıt hatası:", error);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
