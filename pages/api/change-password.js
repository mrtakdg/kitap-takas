import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res
			.status(405)
			.json({ message: "Sadece POST isteği kabul edilir." });
	}

	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email ve yeni şifre gereklidir." });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(404).json({ message: "Kullanıcı bulunamadı." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: { email },
			data: { password: hashedPassword },
		});

		return res.status(200).json({ message: "Şifre başarıyla güncellendi." });
	} catch (error) {
		console.error("Şifre güncelleme hatası:", error);
		return res.status(500).json({ message: "Sunucu hatası oluştu." });
	}
}
