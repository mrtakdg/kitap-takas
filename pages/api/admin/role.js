import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Yalnızca POST kabul edilir." });
	}

	const { id, role } = req.body;
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token eksik." });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const requesterId = decoded.id;

		if (parseInt(id) === requesterId) {
			return res.status(403).json({
				message: "Admin kendi rolünü değiştiremez.",
			});
		}

		await prisma.user.update({
			where: { id: parseInt(id) },
			data: { role },
		});

		res.status(200).json({ message: "Rol güncellendi." });
	} catch (err) {
		console.error("Rol değiştirme hatası:", err);
		res.status(500).json({ message: "Sunucu hatası." });
	}
}
