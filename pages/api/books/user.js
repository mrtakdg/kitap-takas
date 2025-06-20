import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	const { userId } = req.query;
	if (!userId) return res.status(400).json({ message: "userId eksik." });

	try {
		const books = await prisma.book.findMany({
			where: { ownerId: parseInt(userId) },
			orderBy: { createdAt: "desc" },
		});
		res.status(200).json(books);
	} catch (err) {
		console.error("Kitap çekme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
