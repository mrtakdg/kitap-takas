import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	const { id } = req.query;

	if (!id) {
		return res.status(400).json({ message: "Kullanıcı ID gerekli." });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: parseInt(id) },
			select: {
				id: true,
				email: true,
				role: true,
				firstName: true,
				lastName: true,
				address: true,
				phone: true,
			},
		});

		if (!user) {
			return res.status(404).json({ message: "Kullanıcı bulunamadı." });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error("Profil çekme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
