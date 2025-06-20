import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	const { userId } = req.query;

	if (!userId) return res.status(400).json({ message: "userId eksik." });

	try {
		const swaps = await prisma.swapRequest.findMany({
			where: { fromUserId: parseInt(userId) },
			include: {
				toUser: { select: { id: true, email: true } },
				bookOffered: true,
				bookWanted: true,
			},
			orderBy: { createdAt: "desc" },
		});

		res.status(200).json({ swaps });
	} catch (err) {
		console.error("Gönderilen takas hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
