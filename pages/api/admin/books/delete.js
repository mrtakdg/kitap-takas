import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	const { id } = req.body;
	if (!id) return res.status(400).json({ message: "Kitap ID gerekli." });

	try {
		await prisma.book.delete({ where: { id: parseInt(id) } });
		res.status(200).json({ message: "Kitap silindi." });
	} catch (err) {
		console.error("Silme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
