import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	const { id, status } = req.body;

	if (!id || !["accepted", "rejected"].includes(status)) {
		return res.status(400).json({ message: "Geçersiz istek." });
	}

	try {
		await prisma.swapRequest.update({
			where: { id: parseInt(id) },
			data: { status },
		});

		res
			.status(200)
			.json({
				message: `Takas ${
					status === "accepted" ? "kabul edildi" : "reddedildi"
				}.`,
			});
	} catch (err) {
		console.error("Yanıt hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
