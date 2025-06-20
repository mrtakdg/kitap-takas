import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	const token = req.headers.authorization?.split(" ")[1];
	const user = verifyToken(token);

	if (!user || user.role !== "admin") {
		return res.status(403).json({ message: "Yetkisiz erişim." });
	}

	try {
		const users = await prisma.user.findMany({
			select: { id: true, email: true, role: true },
		});

		res.status(200).json({ users });
	} catch (err) {
		console.error("Kullanıcıları getirme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
