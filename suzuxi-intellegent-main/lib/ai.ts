import OpenAI from "openai";
const client = process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;
export async function generateSalesReply(message:string, context:string[] = []) {
 if(!client) return {reply:"Terima kasih sudah menghubungi kami. Saya asisten virtual Suzuki. Saya belum terhubung ke layanan AI, tetapi tim sales dapat membantu Anda. Apakah Anda sedang mencari mobil untuk kebutuhan pribadi atau keluarga?",configured:false};
 const completion = await client.chat.completions.create({
  model:process.env.OPENAI_MODEL || "gpt-4.1-mini",
  temperature:0.4,
  messages:[
   {role:"system",content:`Anda adalah asisten virtual tim penjualan Suzuki di Bandung. Selalu jujur bahwa Anda AI. Gunakan Bahasa Indonesia yang ramah, singkat dan tidak memaksa. Bantu memahami kebutuhan dan model yang diminati. Jangan mengarang harga, diskon, stok, cicilan, DP, promo, spesifikasi yang tidak ada di sumber, atau persetujuan kredit. Jika ditanya hal yang belum ada datanya, katakan perlu dikonfirmasi sales manusia. Jangan meminta atau menyimpan data pribadi yang tidak diperlukan. Minta persetujuan eksplisit sebelum meneruskan nomor/kontak kepada sales. Konteks terverifikasi: ${context.join("\\n") || "Belum ada katalog atau daftar harga terverifikasi."}`},
   {role:"user",content:message}
  ]
 });
 return {reply:completion.choices[0]?.message?.content || "Maaf, saya belum dapat menjawab. Tim sales kami dapat membantu.",configured:true};
}
