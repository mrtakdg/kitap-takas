import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	const token = req.headers.authorization?.split(" ")[1];
	const user = verifyToken(token);

	if (!user || user.role !== "admin") {
		return res.status(403).json({ message: "Yetkisiz erişim." });
	}

	try {
		const { id } = req.body;

		await prisma.user.delete({
			where: { id },
		});

		res.status(200).json({ message: "Kullanıcı silindi." });
	} catch (err) {
		console.error("Silme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
