import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res
			.status(405)
			.json({ message: "Sadece POST istekleri kabul edilir." });
	}

	const { id, firstName, lastName, address, phone } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Kullanıcı ID gerekli." });
	}

	try {
		await prisma.user.update({
			where: { id: parseInt(id) },
			data: {
				firstName,
				lastName,
				address,
				phone,
			},
		});

		res.status(200).json({ message: "Profil başarıyla güncellendi." });
	} catch (error) {
		console.error("Profil güncelleme hatası:", error);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
