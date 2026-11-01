
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const client = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

export async function generateSalesReply(
  message: string,
  context: string[] = []
) {
  if (!client) {
    return {
      reply:
        "Terima kasih sudah menghubungi kami. Saya asisten virtual Suzuki. Saat ini layanan AI belum dikonfigurasi. Tim sales kami siap membantu Anda.",
      configured: false,
    };
  }

  const model =
    process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const systemInstruction = `
Anda adalah asisten virtual tim penjualan Suzuki di Bandung.

ATURAN UTAMA:
1. Selalu jujur bahwa Anda adalah AI.
2. Gunakan Bahasa Indonesia yang ramah, profesional,
   singkat, dan tidak memaksa.
3. Bantu pelanggan memahami kebutuhan kendaraan.
4. Tanyakan kebutuhan pelanggan secara bertahap.
5. Jangan mengarang harga, diskon, stok, cicilan,
   DP, promo, spesifikasi, atau persetujuan kredit.
6. Jika informasi belum tersedia, sampaikan bahwa
   tim sales manusia perlu mengonfirmasi.
7. Jangan meminta data pribadi yang tidak diperlukan.
8. Minta persetujuan eksplisit sebelum meneruskan
   nomor atau kontak pelanggan kepada sales.

KONTEKS TERVERIFIKASI:
${
  context.length > 0
    ? context.join("\n")
    : "Belum ada katalog atau daftar harga terverifikasi."
}
`;

  const response = await client.models.generateContent({
    model,
    contents: message,
    config: {
      systemInstruction,
      temperature: 0.4,
      maxOutputTokens: 800,
    },
  });

  return {
    reply:
      response.text ||
      "Maaf, saya belum dapat menjawab. Tim sales kami dapat membantu.",
    configured: true,
  };
}
