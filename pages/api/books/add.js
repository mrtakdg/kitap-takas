import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	const { title, author, description, imageUrl, ownerId } = req.body;

	if (!title || !author || !ownerId) {
		return res.status(400).json({ message: "Zorunlu alanlar eksik." });
	}

	try {
		const book = await prisma.book.create({
			data: { title, author, description, imageUrl, ownerId },
		});
		res.status(201).json(book);
	} catch (err) {
		console.error("Kitap ekleme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
