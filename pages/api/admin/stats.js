// pages/api/admin/stats.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	try {
		const users = await prisma.user.findMany({
			include: {
				books: {
					select: {
						id: true,
						title: true,
						author: true,
						description: true,
						createdAt: true,
					},
				},
			},
		});

		const stats = users.map((u) => ({
			email: u.email,
			books: u.books,
		}));

		res.status(200).json({ stats });
	} catch (err) {
		console.error("İstatistik hatası:", err);
		res.status(500).json({ message: "Sunucu hatası" });
	}
}
