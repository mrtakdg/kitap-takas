// pages/api/admin/update-book.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	const { id, title, author, description } = req.body;

	try {
		const updated = await prisma.book.update({
			where: { id: parseInt(id) },
			data: { title, author, description },
		});

		res.status(200).json({ message: "Kitap güncellendi", book: updated });
	} catch (err) {
		console.error("Güncelleme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası" });
	}
}
