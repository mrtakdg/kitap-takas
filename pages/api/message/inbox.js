import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	const { userId } = req.query;

	if (!userId) return res.status(400).json({ message: "userId eksik" });

	try {
		const messages = await prisma.message.findMany({
			where: { toId: parseInt(userId) },
			include: { from: true },
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json({ messages });
	} catch (err) {
		console.error("Mesajları alma hatası:", err);
		res.status(500).json({ message: "Sunucu hatası" });
	}
}
