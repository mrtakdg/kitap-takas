import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();

	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Kitap ID'si gerekli." });
	}

	try {
		await prisma.swapRequest.deleteMany({
			where: {
				OR: [{ bookOfferedId: parseInt(id) }, { bookWantedId: parseInt(id) }],
			},
		});

		await prisma.book.delete({
			where: { id: parseInt(id) },
		});

		return res
			.status(200)
			.json({ message: "Kitap ve ilişkili takaslar silindi." });
	} catch (err) {
		console.error("❌ Silme hatası:", err);
		return res.status(500).json({ message: "Sunucu hatası." });
	}
}
