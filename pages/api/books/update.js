import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	const { id, title, author, description } = req.body;

	if (!id || !title || !author) {
		return res.status(400).json({ message: "Eksik bilgi." });
	}

	try {
		const updated = await prisma.book.update({
			where: { id: parseInt(id) },
			data: {
				title,
				author,
				description,
			},
			include: {
				owner: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		res.status(200).json({ message: "Kitap güncellendi.", book: updated });
	} catch (err) {
		console.error("Kitap güncelleme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
