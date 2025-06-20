import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	try {
		const books = await prisma.book.findMany({
			include: {
				owner: {
					select: {
						id: true,
						email: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json({ books });
	} catch (err) {
		console.error("Kitapları getirme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
