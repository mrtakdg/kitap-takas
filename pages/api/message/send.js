import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res
			.status(405)
			.json({ message: "Sadece POST isteği kabul edilir." });
	}

	const { fromId, toId, content } = req.body;

	if (!fromId || !toId || !content || content.trim() === "") {
		return res.status(400).json({ message: "Eksik veya geçersiz veri." });
	}

	try {
		const newMessage = await prisma.message.create({
			data: {
				fromId: parseInt(fromId),
				toId: parseInt(toId),
				content,
			},
		});

		res.status(201).json({ message: "Mesaj gönderildi", data: newMessage });
	} catch (err) {
		console.error("Mesaj gönderme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası" });
	}
}
