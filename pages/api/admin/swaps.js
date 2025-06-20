import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	try {
		const swaps = await prisma.swapRequest.findMany({
			include: {
				fromUser: {
					select: { id: true, email: true },
				},
				toUser: {
					select: { id: true, email: true },
				},
				bookOffered: true,
				bookWanted: true,
			},
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json({ swaps });
	} catch (err) {
		console.error("Admin swap listesi hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
