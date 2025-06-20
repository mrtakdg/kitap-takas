import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
			},
		});

		res.status(200).json({ users });
	} catch (err) {
		console.error("Kullanıcı çekme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası" });
	}
}
