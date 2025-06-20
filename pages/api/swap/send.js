import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST")
		return res.status(405).json({ message: "Sadece POST istek kabul edilir." });

	const { fromUserId, toUserId, bookOfferedId, bookWantedId, message } =
		req.body;

	if (!fromUserId || !toUserId || !bookOfferedId || !bookWantedId) {
		return res.status(400).json({ message: "Eksik bilgi gönderildi." });
	}

	try {
		const newSwap = await prisma.swapRequest.create({
			data: {
				fromUserId: parseInt(fromUserId),
				toUserId: parseInt(toUserId),
				bookOfferedId: parseInt(bookOfferedId),
				bookWantedId: parseInt(bookWantedId),
				message,
			},
		});

		res
			.status(201)
			.json({ message: "Takas isteği gönderildi.", swap: newSwap });
	} catch (err) {
		console.error("Takas gönderme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası" });
	}
}
